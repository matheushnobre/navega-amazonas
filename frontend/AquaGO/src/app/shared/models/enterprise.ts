import { customUser } from "./customUser";
import { modelBase } from "./modelBase";

export class enterprise extends modelBase{
    user!:customUser;        //para saber qual usuário representa essa empresa
    fantasy_name!:string;    //nome da empresa
    image!:string | File;           //logo
    cnpj!:string;            //cnpj
}