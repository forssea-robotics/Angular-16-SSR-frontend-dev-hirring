import 'zone.js/node';

// - Angular SSR
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';

// - Node
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Socket } from 'node:net';

// - API Request
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request } from 'express';
import * as expressWs from 'express-ws';
import { WebSocketServer } from 'ws';

// - Modules
import { AppServerModule } from './main.server';

// - Services
import { APIRadioService } from './services/api-radio.service';
import { APIThrusterService } from '../backend/services/api-thruster.service';


const webSocketServers: WebSocketServer[] = [];


/**
 * Express Server Application
 * It's exported so that it can be used by serverless Functions.
 * @returns { expressWs.Application}
 */
export function expressApp(): expressWs.Application {

  // -- Setup Server --//
  const server = expressWs(express()).app;

  // -- Setup compiled source --//
  const distFolder = join(process.cwd(), 'dist/rocketx-hmi/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));
  server.set('view engine', 'html');
  server.set('views', distFolder);

  // -- Middlewares -- //
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use(bodyParser.json());

  // -- Routers -- //
  server.use(APIRadioService.Router);
  server.use(APIThrusterService.Router);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: 'webSocketServers', useValue: webSocketServers },
      ]
    });
  });

  return server;
}

/**
 * Run the server
 */
function run(): void {

  // -- Setup server port --//
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const app = expressApp();
  const server = app.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}`);
    console.log(`Node Express server listening on http://localhost:${port}`);

    server.on('upgrade', (request: Request, socket: Socket, head: Buffer) => {
      const index = request.url.indexOf('?');
      const pathname = index !== -1 ? request.url.slice(0, index) : request.url;

      // Try to find the wsServer that match this route
      const wsServerChosenOne = webSocketServers.find((element) => element.options.path === pathname);

      // Abort if no webSocket server has been registered for this route
      if (!wsServerChosenOne) return;

      // Let the weServer handle the upgrade
      wsServerChosenOne.handleUpgrade(request, socket, head, (websocket) => {
        console.log('Upgrade has been handle on express server for a WebSocket');
        wsServerChosenOne.emit('connection', websocket, request);
      });
    });
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './main.server';
