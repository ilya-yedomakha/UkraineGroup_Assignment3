export class BonusData {
    constructor(
        public _id: string,
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
            goal_description: string;
            target_value: number;
            actual_value: number;
            bonus: number;
        }>,
        public remarks: string | null,
        public totalBonus: number,
        public isConfirmedByCEO: boolean,
        public isConfirmedBySalesman: boolean,
        public isConfirmedByHR: boolean,
        public isSent: boolean
    ) {
    }

    public getOrderBonusesTotal(): number {
        return this.ordersBonuses.reduce((sum, ob) => sum + ob.bonus, 0);
    }

    public getSocialBonusesTotal(): number {
        return this.socialBonuses.reduce((sum, sb) => sum + sb.bonus, 0);
    }

    public getTotalBonuses(): number {
        return this.getOrderBonusesTotal() + this.getSocialBonusesTotal();
    }

    static fromApi(data: any): BonusData {
        return new BonusData(
            data._id,
            data.firstname,
            data.lastname,
            data.ordersBonuses,
            data.socialBonuses,
            data.remarks,
            data.totalBonus,
            data.isConfirmedByCEO,
            data.isConfirmedBySalesman,
            data.isConfirmedByHR,
            data.isSent
        );
    }
}
