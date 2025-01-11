export class SalePerformanceRecord {
    constructor(
        public salesOrderName: string,
        public activeYear: number,
        public priority: number,
        public salesmanGovId: number,
        public clientFullName: string,
        public clientRating: number,
        public positionLineItemNumber: number,
        public positionName: string,
        public positionNumber: number,
        public positionPricePerUnit: number,
        public items: number,
        public positionPricingStatus: string,
        public positionBaseAmount: number,
        public positionDiscountAmount: number,
        public productNumber: number,
        public productName: string,
    ) {
    }
}
