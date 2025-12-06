import { Harbor } from "./harbor";
import { modelBase } from "./modelBase";
import { trip } from "./trip";

export class TripStop extends modelBase{
    stop_datetime!:Date;
    number_of_shipments!:number;
    number_of_lands!:number;
    is_departure_stop!:boolean;
    is_arrival_stop!:boolean;
    harbor!:Harbor;
    trip!:trip;
}