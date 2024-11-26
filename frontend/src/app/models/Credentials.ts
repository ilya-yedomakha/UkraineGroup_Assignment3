/**
 * this model specifies the format to exchange credentials with the backend
 */
export class Credentials{
    constructor(
        public username: string,
        public password: string
    ) {  }
}
