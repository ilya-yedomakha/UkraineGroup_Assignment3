export class BonusData {
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public ordersBonuses: Array<{
            productName: string;
            clientFullName: string;
            clientRating: string;
            items: number;
            bonus: number;
        }>,
        public socialBonuses: Array<{
            name:string,
            targetValue:number,
            actualValue:number,
            bonus: number;
        }>,
        public remarks: string | null,
        public totalBonus: number,
        public isConfirmedByCEO: boolean,
        public isConfirmedBySalesman: boolean
    ) {}

   public getOrderBonusesTotal(): number {
        return this.ordersBonuses.reduce((sum, ob) => sum + ob.bonus, 0);
    }
    public getSocialBonusesTotal(): number {
        return  this.socialBonuses.reduce((sum, sb) => sum + sb.bonus, 0);
    }
    public getTotalBonuses(): number {
        return this.getOrderBonusesTotal() + this.getSocialBonusesTotal();
    }

}