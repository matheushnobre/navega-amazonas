import { customUser } from "./customUser";
import { modelBase } from "./modelBase";

export class enterpriseDTO extends modelBase{
    user!:customUser; //para saber qual usuário representa essa empresa
    fantasy_name!:File;    //nome da empresa
    image!:string;           //logo
    cnpj!:string;            //cnpj
}