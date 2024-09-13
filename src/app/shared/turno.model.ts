
export class Turno {
    titolo: string;
    inizio: Date;
    fine: Date;
    id: string;
    idturnorif: string;
    idturnopre: string;
    preiscrizione: boolean;
    diaria: number;
    year: number;
    id_pre_isc_online: number;

    constructor() {
        // this.days = TurnoDay.creaGiornatePerTurno(this);
        this.preiscrizione = false;
        this.diaria = 0;
    }

}
