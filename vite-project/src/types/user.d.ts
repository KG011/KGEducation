interface User {
    username?: string;
    password?: string;
    real_name?:string;
    userId?:number;
    role?:string
}
interface LoginData {
    username: string,
    password: string
}