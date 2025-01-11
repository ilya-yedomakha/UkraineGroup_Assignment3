export class SocialPerformanceRecord {
    public _id: number | null;

    // TODO possible error
    constructor(
        public goal_description: string,
        public target_value: number,
        public actual_value: number,
        public year: number,
        public salesman_code: number,
    ) {
    }
}
