export class RejectionMessage {
    public _id: string | null;

    constructor(
        public salesman_code: number,
        public report_id: string | null,
        public year: number | null,
        public message: string
    ) {
    }
}
