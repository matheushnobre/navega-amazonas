import { ChangeDetectorRef, Component } from '@angular/core';
import { EnterpriseService } from '../../../core/services/enterprise-service';
import { UserService } from '../../../core/services/user-service';
import { enterprise } from '../../../shared/models/enterprise';
import { CommonModule, Location } from '@angular/common';
import { Nav } from "../../../core/components/nav/nav";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { Footer } from "../../../core/components/footer/footer";
import { trip } from '../../../shared/models/trip';
import { FormsModule } from '@angular/forms';
import { vessel } from '../../../shared/models/vessel';
import { ActivatedRoute } from '@angular/router';
import { Harbor } from '../../../shared/models/harbor';
import { City } from '../../../shared/models/city';
import { CityService } from '../../../core/services/city-service';
import { TripService } from '../../../core/services/trip-service';

@Component({
  selector: 'app-register-trip',
  imports: [Nav, CustomInput, CustomButton, Footer,CommonModule,FormsModule],
  templateUrl: './register-trip.html',
  styleUrl: './register-trip.scss',
})
export class RegisterTrip {
  vessels:vessel[] = []
  harborDeparture: Harbor[] = []
  harborArrival: Harbor[] = []
  citys: City[] = []

  departure_date:string = "2025-05-20";
  departure_time:string = '05:00';
  
  arrival_date:string = "2025-05-20";
  arrival_time:string = '05:00';
  
  selectedDepartureCity:City | null = null;
  selectedArrivalCity:City | null = null;
  
  id!:number;

  trip:trip={
    departure_datetime:'20-05-2025',
    departure_harbor:null,
    arrival_harbor:null,
    arrival_datetime:'20-05-2025',
    individual_base_price:0,
    cabin_base_price:0,
  };

  constructor(
    private location:Location,
    private activatedRoute:ActivatedRoute,
    private enterpriseService:EnterpriseService,
    private cityService: CityService,
    private cdr: ChangeDetectorRef,
    private tripService:TripService
  ){
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.load()
  }
  register(event:Event){
    event.preventDefault();
    this.reloadData();
    this.tripService.add(this.trip).subscribe({
      next:(dados)=> {
        alert("Viagem cadastrada com sucesso");
      },error(err) {
        alert("Erro ao cadastrar")
        console.log(err);
      },
    })
  }
  load(){
    this.loadVessels();
    this.loadCitys();
  }
  loadVessels(){
    this.enterpriseService.getVessels(this.id).subscribe({
      next:(dados)=> {
        this.vessels = dados;
      },error(err) {
        console.log("erro ao buscar dados de empresa");
      },
    })
  }
  loadCitys(){
    this.cityService.getAll().subscribe({
      next:(dados)=> {
        this.citys = dados;
      },error(err){
        console.log("Erro ao carregar cidades")
      }
    })
  }
  loadDepartureHarbor() {
    this.trip.departure_harbor = null;
    this.harborDeparture = [];

    const cityId = this.selectedDepartureCity?.id;
    if (!cityId) return;

    this.cityService.getHarbors(cityId).subscribe({
      next: (data) => {
        this.harborDeparture = data;
      },
      error: () => {
        this.harborDeparture = [];
      }
    });
  }
  loadArrivalHarbor() {
    this.trip.arrival_harbor = null;
    this.harborArrival = [];

    const cityId = this.selectedArrivalCity?.id;
    if (!cityId) return;

    this.cityService.getHarbors(cityId).subscribe({
      next: (data) => {
        this.harborArrival = data;
      },
      error: () => {
        this.harborArrival = [];
      }
    });
  }
  reloadData(){
    const departure_datetime = new Date(`${this.departure_date}T${this.departure_time}:00`);
    const arrival_datetime = new Date(`${this.arrival_date}T${this.arrival_time}:00`);
    this.trip.departure_datetime = departure_datetime.toISOString();
    this.trip.arrival_datetime = arrival_datetime.toISOString();
  }
}
