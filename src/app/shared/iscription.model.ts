

export class Inscription {
    success: boolean;
    name: string;
    surname: string;
    birthDay: Date;
    city: string;

    isOfCarpaneto: boolean;

    firChoice: string;
    secChoice: string;
    firWeek1: boolean;
    firWeek2: boolean;
    secWeek1: boolean;
    secWeek2: boolean;

    pre1s_0_1: boolean;
    pre1s_1_1: boolean;
    pre1s_1_2: boolean;
    pre1s_2_1: boolean;
    pre1s_2_2: boolean;
    pre1s_3_1: boolean;
    pre1s_3_2: boolean;

    pre2s_0_1: boolean;
    pre2s_1_1: boolean;
    pre2s_1_2: boolean;
    pre2s_2_1: boolean;
    pre2s_2_2: boolean;
    pre2s_3_1: boolean;
    pre2s_3_2: boolean;

    created_by: number;
    created_at: Date;
    updated_at: Date;

    status: string;

    year: number;
    birthYear: number;

    constructor() {
    }


  static createFromJsonObject(jsonObject: any): Inscription {
    const constituent = new Inscription();
    const actUser = Object.assign(constituent, jsonObject);
    return actUser;
  }

}
