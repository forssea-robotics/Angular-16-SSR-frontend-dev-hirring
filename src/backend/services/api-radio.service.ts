import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// - API Modules
import { Router, Request, Response } from 'express';
import { StatusCode } from 'status-code-enum';
import * as ws from 'ws';

// - Models
import { IRadio, Radio } from 'src/shared/models/radio';

// - API Path
import { API_PATH_RADIO } from 'src/shared/constants/constants-path';

// - Debug
import * as debug from 'debug';
const log = debug('app:api-radio-service');


@Injectable({
  providedIn: 'root'
})
export class APIRadioService {
  private static _instance: APIRadioService;

  // Constants
  private readonly _RADIO_NAME = 'Radio';
  private readonly _MIN_FREQUENCY = 88;
  private readonly _MAX_FREQUENCY = 108;

  // Fake data by default
  private _radio: IRadio = {
    name: this._RADIO_NAME,
    powerOn: true,
    frequency: 100
  };
  private readonly _fakeRadioData: Radio = new Radio(this._radio);

  private _radioSubject!: BehaviorSubject<Radio>;
  get radio(): Radio {
    return this._radioSubject.getValue();
  }
  get radio$(): Observable<Radio> {
    return this._radioSubject.asObservable();
  }


  constructor() {

    // Singleton: If the single instance has never been created, we need to create one with the current constructed one.
    if (APIRadioService._instance) {
      log('New connection : using APIRadioService singleton');
      return APIRadioService._instance;
    } else {
      log('Building APITRadioService');
      APIRadioService._instance = this;
      this._radioSubject = new BehaviorSubject<Radio>(this._fakeRadioData);
    }
  }



  // -- Getters
  public static get instantiated(): boolean {
    return !!APIRadioService._instance;
  }

  public static get Instance() {
    return APIRadioService._instance;
  }

  // -- Router
  public static get Router() {
    const router = Router();

    router.route(API_PATH_RADIO)
      .get(APIRadioService._getRadioState)

    router.route(API_PATH_RADIO)
      .put(APIRadioService._updateRadioState);

    router.ws(
      API_PATH_RADIO,
      APIRadioService._radioStateWS
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
      if (!APIRadioService.instantiated) return res.sendStatus(StatusCode.ServerErrorServiceUnavailable);
      return originalMethod.apply(this, [req, res]);
    };
  }


  /**
   * Retrieve the current radio state
   * @param { Request } _req - The Request object from Express
   * @param { Response } res - The Response object from Express
   * @returns { Promise<Response<any, Record<string, any>>> } The Express object response
   */
  @APIRadioService._checkInstantiated
  private static async _getRadioState(_req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    const instance = APIRadioService.Instance;
    const radioState = instance.radio;

    return res.status(StatusCode.SuccessOK).send({ radioState });
  }

  /**
   * Update the current radio state (power on/off and frequency)
   * @param { Request } req - The Request object from Express
   * @param { Response } res - The Response object from Express
   * @returns { Promise<Response<any, Record<string, any>> | undefined> } The Express object response
   */
  @APIRadioService._checkInstantiated
  private static async _updateRadioState(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    const instance = APIRadioService.Instance;
    const radioState: IRadio = req.body;

    // Security checking
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Body is empty.' });
    }
    if (radioState.name === undefined || radioState.name === null || radioState.name !== instance._fakeRadioData.name) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'The radio name is not correct.' });
    }

    if(typeof(radioState.powerOn) !== 'boolean') {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Radio power on/off is not of correct type.' });
    }

    if(typeof(radioState.frequency) !== 'number') {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Radio frequency is not of correct type.' });
    }
    if(radioState.frequency < instance._MIN_FREQUENCY || radioState.frequency > instance._MAX_FREQUENCY) {
      return res.status(StatusCode.ClientErrorBadRequest).send({ msg: `Radio frequency is not in the correct range: [${instance._MIN_FREQUENCY} - ${instance._MAX_FREQUENCY}].` });
    }

    if(radioState.powerOn !== instance._fakeRadioData.powerOn) {
      instance._fakeRadioData.powerOn = radioState.powerOn;
      instance._radioSubject.next(instance._fakeRadioData);
      return res.status(StatusCode.SuccessOK).send({ msg: 'Radio power has been successfully updated.' });
    }

    if(radioState.frequency !== instance._fakeRadioData.frequency) {
      instance._fakeRadioData.frequency = radioState.frequency;
      instance._radioSubject.next(instance._fakeRadioData);
      return res.status(StatusCode.SuccessOK).send({ msg: 'Radio frequency has been successfully updated.' });
    }

    return res.status(StatusCode.ClientErrorBadRequest).send({ msg: 'Radio state has not change.' });
  }


   /**
   * Retrieve the current radio state
   * @param { Ws } ws - The Websocket object from Websocket
   * @returns { Promise<Response<any, Record<string, any>>> } The Express object response
   */
  private static _radioStateWS(ws: ws): void {
    const instance = APIRadioService.Instance;
    const subscription = instance.radio$.subscribe((v: Radio) => ws.send(JSON.stringify(v)));
    ws.on('close', () => subscription.unsubscribe());
  }

}
