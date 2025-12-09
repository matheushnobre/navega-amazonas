import { Component } from '@angular/core';
import { Nav } from "../../../core/components/nav/nav";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { Harbor } from '../../../shared/models/harbor';
import { City } from '../../../shared/models/city';
import { CityService } from '../../../core/services/city-service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from "../../../core/components/footer/footer";
import { ActivatedRoute } from '@angular/router';
import { TripStop } from '../../../shared/models/tripStop';
import { TripStopsService } from '../../../core/services/trip-stops-service';

@Component({
  selector: 'app-register-trip-segment',
  imports: [Nav, CustomInput, CustomButton, CommonModule, FormsModule, Footer],
  templateUrl: './register-trip-segment.html',
  styleUrl: './register-trip-segment.scss',
})
export class RegisterTripSegment {

  harbors:Harbor[] = [];
  citys:City[] = [];

  selectedCity:City| null = null;
  tripStop:TripStop ={
    harbor:0,
    stop_datetime:'',
    trip:0
  };

  stop_date:string = "2025-05-20";
  stop_time:string = '05:00';

  constructor(
    private location:Location,
    private cityService:CityService,
    private tripStopService:TripStopsService,
    private activatedRoute:ActivatedRoute
  ){
    this.tripStop.trip = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCitys();
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
  loadHarbor() {
    this.tripStop.harbor = null;
    this.harbors = [];

    const cityId = this.selectedCity?.id;
    if (!cityId) return;

    this.cityService.getHarbors(cityId).subscribe({
      next: (data) => {
        this.harbors = data;
      },
      error: () => {
        this.harbors = [];
      }
    });
  }
  register(event:Event){
    event.preventDefault();
    this.reloadData();
    console.log(this.tripStop);
    this.tripStopService.add(this.tripStop).subscribe({
      next:(value)=> {
        alert("Parada cadastrada");
        this.location.back();

      },error:(err)=> {
        alert("Erro ao cadastrar parada");
      },
    });
  }
  reloadData(){
    const stop_datetime_local = `${this.stop_date}T${this.stop_time}:00-04:00`;
    this.tripStop.stop_datetime = stop_datetime_local;
  }
}
