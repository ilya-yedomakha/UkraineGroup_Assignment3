export class Bonuses{
    constructor(
        public _id: string,
        public year: number,
        public bonusesForSales: number,
        public bonusesForSocial: number,
        public totalBonuses: number,
        public isConfirmedBySalesman: boolean,
        public isRemarkConfirmedByHR: boolean,
        public remarks: string
    ) {  }

    static fromApi(data: any): Bonuses {
        const bonusesForSales: number = data.ordersBonuses.reduce((sum: number, item) => sum + item.bonus, 0);
        const bonusesForSocial: number = data.socialBonuses.reduce((sum: number, item) => sum + item.bonus, 0);
        return new Bonuses(
            data._id,
            data.year,
            bonusesForSales,
            bonusesForSocial,
            data.totalBonus,
            data.isConfirmedBySalesman,
            data.isRemarkConfirmedByHR,
            data.remarks
        );
    }
}
