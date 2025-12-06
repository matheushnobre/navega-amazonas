import { modelBase } from "./modelBase";
import { City } from "./city";

export class Harbor extends modelBase{
    name!: string;
    city!: City;
}