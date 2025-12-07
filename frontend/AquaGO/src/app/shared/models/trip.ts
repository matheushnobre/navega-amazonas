import { Vessel } from "../../features/vessel/vessel";
import { Harbor } from "./harbor";
import { modelBase } from "./modelBase";
import { TripStop } from "./tripStop";

export class trip extends modelBase{
    departure_datetime!:Date;      //Data e hora de partida
    arrival_datetime!:Date;        //Data e hora de chegada
    departure_harbor!:Harbor;      //Porto de partida
    arrival_harbor!:Harbor;        //Porto de chegada
    individual_base_price!:number; //Preço base individual
    cabin_base_price!:number;      //Preço base de cabine
    vessel!:Vessel | number;       //Embarcação / Navio
    trip_stops?:TripStop[];        //Paradas
}
