import { customUser } from "./customUser";
import { modelBase } from "./modelBase";

export class enterprise extends modelBase{
    //user?:customUser;                    //para saber qual usuário representa essa empresa
    fantasy_name!:string;                  //nome da empresa
    image!:string | File | null;           //logo
    cnpj!:string;                          //cnpj
    vessels_count?:number;              //quantidade de embarcações nesta empresa
}