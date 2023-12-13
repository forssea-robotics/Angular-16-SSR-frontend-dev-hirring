import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// - API Modules
import { Router, Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';
import * as ws from 'ws';

// - Models
import { IThruster, Thruster } from 'src/shared/models/thruster';

// - API Path
import { API_PATH_THRUSTER_LIST } from 'src/shared/constants/constants-path';

// - Utils
import { isNumber } from 'src/shared/utils/number';

// - Debug
import * as debug from 'debug';
const log = debug('app:api-thruster-service');


@Injectable({
  providedIn: 'root'
})
export class APIThrusterService {
  private static _instance: APIThrusterService;

  // Constants
  private readonly _THRUSTER_ID = [1, 2, 3, 4, 5, 6];
  private readonly _THRUSTER_NAMES = [
    'Forward port',
    'Forward starboard',
    'Vertical port',
    'Vertical starboard',
    'Aft port',
    'Aft starboard'
  ];

  private readonly _MIN_THRUST = 0;
  private readonly _MAX_THRUST = 40;
  private readonly _MAX_TANK_CAPACITY = 40_000;

  // Fake data by default
  private _thruster1: IThruster = {
    id: this._THRUSTER_ID[0],
    name: this._THRUSTER_NAMES[0],
    powerOn: true,
    thrust: 15,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 20_000 }
  };

  private _thruster2: IThruster = {
    id: this._THRUSTER_ID[1],
    name: this._THRUSTER_NAMES[1],
    powerOn: true, thrust: 20,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 30_000 }
  };

  private _thruster3: IThruster = {
    id: this._THRUSTER_ID[2],
    name: this._THRUSTER_NAMES[2],
    powerOn: true,
    thrust: 15,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 20_000 }
  };

  private _thruster4: IThruster = {
    id: this._THRUSTER_ID[3],
    name: this._THRUSTER_NAMES[3],
    powerOn: true,
    thrust: 15,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 20_000 }
  };

  private _thruster5: IThruster = {
    id: this._THRUSTER_ID[4],
    name: this._THRUSTER_NAMES[4],
    powerOn: true,
    thrust: 14,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 20_000 }
  };

  private _thruster6: IThruster = {
    id: this._THRUSTER_ID[5],
    name: this._THRUSTER_NAMES[5],
    powerOn: true,
    thrust: 25,
    tank: { capacity: this._MAX_TANK_CAPACITY, currentLevel: 10_000 }
  };

  private readonly _fakeThrusterData: Thruster[] = [
    new Thruster(this._thruster1),
    new Thruster(this._thruster2),
    new Thruster(this._thruster3),
    new Thruster(this._thruster4),
    new Thruster(this._thruster5),
    new Thruster(this._thruster6)
  ];


  private _thrusterListSubject!: BehaviorSubject<Thruster[]>;
  get thrusterList(): Thruster[] {
    return this._thrusterListSubject.getValue();
  }
  get thrusterList$(): Observable<Thruster[]> {
    return this._thrusterListSubject.asObservable();
  }


  constructor() {

    // Singleton: If the single instance has never been created, we need to create one with the current constructed one.
    if (APIThrusterService._instance) {
      log('New connection : using APIThruserService singleton');
      console.log('New connection : using APIThruserService singleton');
      return APIThrusterService._instance;
    } else {
      log('Building APIThrusterService');
      console.log('Building APIThrusterService');
      APIThrusterService._instance = this;
    }
    this._thrusterListSubject = new BehaviorSubject<Thruster[]>(this._fakeThrusterData);
  }



  // -- Getters
  public static get instantiated(): boolean {
    return !!APIThrusterService._instance;
  }

  public static get Instance() {
    return APIThrusterService._instance;
  }

  // -- Router
  public static get Router() {
    const router = Router();

    router.route(API_PATH_THRUSTER_LIST)
      .get(APIThrusterService._getThrusterListState)

    router.route(`${API_PATH_THRUSTER_LIST}/:id`)
      .put(APIThrusterService._updateOneThrusterStateById);

    router.ws(
      API_PATH_THRUSTER_LIST,
      APIThrusterService._thrusterStateWS
    )

    return router;
  }




  // --- Private --- //

  /**
   * Decorator to check if ensure service has been instantiated before doing API Stuff
   * @param { any } _target - The target
   * @param { String }  _propertyKey - The property key
   * @param { PropertyDescriptor } descriptor - The descriptor
   */
  private static _checkInstantiated(_target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    // Wrapping the original method
    descriptor.value = function (req: Request, res: Response) {
      if (!APIThrusterService.instantiated) return res.sendStatus(StatusCode.ServerErrorServiceUnavailable);
      return originalMethod.apply(this, [req, res]);
    };
  }


  /**
   * Retrieve the current thrusters list state
   * @param { Request } _req - The Request object from Express
   * @param { Response } res - The Response object from Express
   * @returns { Promise<Response<any, Record<string, any>>> } The Express object response
   */
  @APIThrusterService._checkInstantiated
  private static async _getThrusterListState(_req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const instance = APIThrusterService.Instance;
    const thrusterListState = instance.thrusterList;

    return res.status(StatusCode.SuccessOK).send(thrusterListState);
  }

  /**
   * Update one thruster
   * @param { Request } req - The Request object from Express
   * @param { Response } res - The Response object from Express
   * @returns { Promise<Response<any, Record<string, any>>> } The Express object response
   */
  @APIThrusterService._checkInstantiated
  private static async _updateOneThrusterStateById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const instance = APIThrusterService.Instance;
    const newPowerOn: boolean = req.body.powerOn;
    const paramId = parseInt(req.params['id'].toString(), 10);


    // Security checking \\

    // Param Id requested
    if (paramId === undefined || paramId === null) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'You must set the thruster id.' });
    }
    if (!isNumber(paramId)) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Thruster id must be an integer number.' });
    }
    if (paramId < 0 || paramId > instance._THRUSTER_ID.length) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: `Only ${instance._THRUSTER_ID.length} thrusters are avalaible.` });
    }

    // Body sended
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Body is empty.' });
    }
    if (typeof(newPowerOn) !== 'boolean') {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Thruster power on/off is not of correct type.' });
    }


    // After passed security checking, find the requested thruster
    const thruster = instance._fakeThrusterData.find((element: Thruster) => element.id === paramId);
    if(thruster !== undefined) {
      if(thruster.powerOn !== newPowerOn) {
        thruster.powerOn = newPowerOn;
        instance._thrusterListSubject.next(instance._fakeThrusterData);
        return res.status(StatusCode.SuccessOK).send({ msg: `The thruster's power has been successfully updated.` });
      }
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: `The thruster's power has not changed.` });
    }
    return res.status(StatusCode.ServerErrorInternal).send({ msg: 'Thruster not found.' });
  }


   /**
   * Retrieve the current thrusters list state
   * @param { Ws } ws - The Websocket object from Websocket
   * @returns { Promise<Response<any, Record<string, any>>> } The Express object response
   */
  @APIThrusterService._checkInstantiated
  private static _thrusterStateWS(ws: ws): void {
    const instance = APIThrusterService.Instance;
    instance._handleRandomThrustData();
    const subscription = instance.thrusterList$.subscribe((v: Thruster[]) => ws.send(JSON.stringify(v)));
    ws.on('close', () => subscription.unsubscribe());
  }

  /**
   * Handle random thrust data
   * @returns { Void }
   */
  private _handleRandomThrustData(): void {
    setInterval(() => {
      this._fakeThrusterData.forEach((element) => {
        if(!element.powerOn) {
          element.thrust = 0;
        } else {
          element.thrust = this._generateRandomNumber(this._MIN_THRUST, this._MAX_THRUST);
        }
      });
      this._thrusterListSubject.next(this._fakeThrusterData);
    }, 1_000);

  }

  /**
   * Returns an integer random number between a min (included) and a max (included)
   * @param { Number } min - Minimum
   * @param { Number} max - Maximum
   * @returns { Number } The integer random number
   */
  private _generateRandomNumber(min: number, max: number): number {
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  }

}
