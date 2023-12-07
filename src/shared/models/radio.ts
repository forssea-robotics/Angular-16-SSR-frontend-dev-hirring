export interface IRadio {
  name: string,
  frequency: number // unit Hertz
}


/**
 * Object representing a Radio
 */
export class Thruster {
  name: string;
  frequency: number

  constructor(data: IRadio) {
    this.name = data.name;
    this.frequency = data.frequency;
  }

}
