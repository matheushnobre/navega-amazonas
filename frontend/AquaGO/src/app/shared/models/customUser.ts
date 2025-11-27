import { enterprise } from "./enterprise";

//verificar se customUser herda de modelBase
export class customUser{
    id!:number;
    email!:string;
    username!:string;
    enterprises!:enterprise[];
    cpf!:string 
    password!:string;
}