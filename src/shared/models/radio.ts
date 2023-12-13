export interface IRadio {
  readonly name: string,
  powerOn: boolean,
  frequency: number // unit Hertz
}

/**
 * Object representing a Radio
 */
export class Radio {
  readonly name: string;
  powerOn: boolean;
  frequency: number

  constructor(data: IRadio) {
    this.name = data.name;
    this.powerOn = data.powerOn;
    this.frequency = data.frequency;
  }

}
