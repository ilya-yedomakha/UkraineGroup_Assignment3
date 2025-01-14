export class Bonuses{
    constructor(
        public year: number,
        public bonusesForSales: number,
        public bonusesForSocial: number,
        public totalBonuses: number
    ) {  }

    static fromApi(data: any): Bonuses {
        const bonusesForSales: number = data.ordersBonuses.reduce((sum: number, item) => sum + item.bonus, 0);
        const bonusesForSocial: number = data.socialBonuses.reduce((sum: number, item) => sum + item.bonus, 0);
        return new Bonuses(
            data.year,
            bonusesForSales,
            bonusesForSocial,
            data.totalBonus
        );
    }
}
