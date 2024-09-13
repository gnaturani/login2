
export class User {
    name?: string;
    surname?: string;
    username?: string;
    token?: string;

    constructor() {
    }


  static createFromJsonObject(jsonObject: any): User {
    const constituent = new User();
    const actUser = Object.assign(constituent, jsonObject);
    return actUser;
  }

}
