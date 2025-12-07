import { modelBase } from "./modelBase";
import { trip} from "./trip";
import { TripStop } from "./tripStop";

export class TripSegment extends modelBase{
    trip!:trip;
    from_stop!:TripStop;
    to_stop!:TripStop;
    individual_price!:number;
}