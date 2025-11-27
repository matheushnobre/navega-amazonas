import { enterprise } from "./enterprise";

export class vessel{
    name!:string;
    image!:File;
    registry_code!:string;
    vessel_type!:string;
    individual_capacity!: number //faltou consertar no banco
    enterprise!: enterprise; 
}