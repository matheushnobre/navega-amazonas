import { Harbor } from "./harbor";
import { modelBase } from "./modelBase";
import { TripStop } from "./tripStop";
import { vessel } from "./vessel";

export class trip extends modelBase{
    departure_datetime!:string;    //Data e hora de partida
    arrival_datetime!:string;      //Data e hora de chegada
    departure_harbor!: number | null;      //Porto de partida
    arrival_harbor!: number | null;        //Porto de chegada
    individual_base_price!:number; //Preço base individual
    cabin_base_price!:number;      //Preço base de cabine
    vessel?:vessel | number;       //Embarcação / Navio
    trip_stops?:TripStop[];        //Paradas
}
