import { enterprise } from "./enterprise";

export class vessel{
    name!:string;
    image!: File | string;
    registry_code!:string;
    vessel_type!:string;
    individual_capacity!: number; //faltou consertar no banco
    enterprise!: enterprise; 
    number_of_cabins!:number;
}