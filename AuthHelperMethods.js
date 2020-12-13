import decode from "jwt-decode";

export default class AuthHelperMethods {

    constructor(domain) {
        this.domain = domain || "http://localhost:3000";
    }
    
}