export interface IThruster {
  readonly id: number,
  readonly name: string,
  powerOn: boolean,
  thrust: number, // unit Mega Water
  tank: ITank
}


export interface ITank {
  readonly capacity: number, // unit Litre
  currentLevel: number // unit Litre
}

/**
 * Object representing a Thruster
 */
export class Thruster {
  readonly id: number;
  readonly name: string;
  powerOn: boolean;
  thrust: number;
  tank: ITank

  constructor(data: IThruster) {
    this.id = data.id;
    this.name = data.name;
    this.powerOn = data.powerOn;
    this.thrust = data.thrust;
    this.tank = data.tank
  }

}
