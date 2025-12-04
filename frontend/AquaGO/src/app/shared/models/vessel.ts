import { enterprise } from "./enterprise";
import { modelBase } from "./modelBase";

export class vessel extends modelBase{
    vessel_type!:string;                     //barco ou lancha
    name!:string;                            //nome da embarcação
    image!: File | string | null;                   //logo
    registry_code!:string;                   //código de registro
    individual_capacity!: number;            //capacidade da lancha
    enterprise!: enterprise | number;        //empresa
    number_of_cabins!:number;                //número de cabinhes
}