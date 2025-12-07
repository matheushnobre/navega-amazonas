import { customUser } from "./customUser";
import { modelBase } from "./modelBase";
import { TripSegment } from "./tripSegment";

export class Ticket extends modelBase{
    trip_segment!:TripSegment|null | number
    type_of_accommodation!:string|null
    passenger!:customUser|null | number
    price!:number|null
    status!:string|null
}