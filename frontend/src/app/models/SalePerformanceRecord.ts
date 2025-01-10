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
        public positionNumber: string,
        public positionPricePerUnit: number,
        public items: number,
        public positionPricingStatus: string,
        public positionBaseAmount: number,
        public positionDiscountAmount: number,
        public productNumber: string,
        public productName: string,
    ) {
    }
}
