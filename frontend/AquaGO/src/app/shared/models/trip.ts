import { Vessel } from "../../features/vessel/vessel";
import { Harbor } from "./harbor";
import { modelBase } from "./modelBase";

export class trip extends modelBase{
    departure_datetime!:Date;
    arrival_datetime!:Date;
    departure_harbor!:Harbor;
    arrival_harbor!:Harbor;
    individual_base_price!:number;
    cabin_base_price!:number;
    vessel!:Vessel;
}