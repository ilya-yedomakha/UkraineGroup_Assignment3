
/**
 * this model specifies the format to exchange a user with the backend
 */
export class User{
    constructor(
        public _id: string,
        public username: string,
        public code: number,
        public lastname: string,
        public firstname: string,
        public email: string,
        public role: number,
        public isAdmin: boolean
    ) {  }
}
