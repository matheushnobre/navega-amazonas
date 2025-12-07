import { enterprise } from "./enterprise";

//verificar se customUser herda de modelBase
export class customUser{
    id?:number | null;
    image?: File | string | null;

    name!:string; 
    email!:string;
    cpf!:string;
    password!:string;
    
    username?:string | null;
    enterprises?:enterprise[] | null;
}