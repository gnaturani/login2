export class Returnapi {
    success?: boolean;
    returnMessages?: Array<string>;
    returnObject?: Object;

    constructor() {
    }

  static createFromJsonObject(jsonObject: any): Returnapi {
    const constituent = new Returnapi();
    const actUser = Object.assign(constituent, jsonObject);
    return actUser;
  }
}
