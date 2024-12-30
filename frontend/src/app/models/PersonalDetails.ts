export class PersonalDetails{
    constructor(
        public employeeId:number,
        public firstname: string,
        public middlename: string,
        public lastname: string,
        public gender:string,
        public dateOfBirth: string,
        public address: string,
        public contactNumber: string,
        public jobTitle: string,
        public joinedDate: string,
        public salary:number,
        public workEmail: string,
        public reportTo: string,
        public nationality: string,
    ) {  }
}