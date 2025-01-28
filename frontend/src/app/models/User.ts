
/**
 * this model specifies the format to exchange a user with the backend
 */
export class User{
    public _id!: string
    constructor(
        public username: string,
        public code: number,
        public lastname: string,
        public firstname: string,
        public email: string,
        public role: number,
    ) {  }
}
