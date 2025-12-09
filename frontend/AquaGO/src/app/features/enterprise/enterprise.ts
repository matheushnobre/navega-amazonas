import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { Footer } from "../../core/components/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { vessel } from '../../shared/models/vessel';
import { ActivatedRoute, Router } from '@angular/router';
import { VesselService } from '../../core/services/vessel-service';
import { environment } from '../../../environments/environments';
import { EnterpriseService } from '../../core/services/enterprise-service';
import { trip } from '../../shared/models/trip';
import { TripService } from '../../core/services/trip-service';

@Component({
  selector: 'app-enterprise',
  imports: [Nav, Footer, CustomButton],
  templateUrl: './enterprise.html',
  styleUrl: './enterprise.scss',
})
export class Enterprise {
  vessels:vessel [] = [];
  trips:trip[] = [];
  id!:number;
  path = environment.apiUrl;

  constructor(private router:Router,
    private activatedRoute:ActivatedRoute,
    private enterpriseService:EnterpriseService,
    private vesselService:VesselService,
  ){
      this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.loadVessels();
      this.loadTrips();
  }
  addVessel(){
    this.router.navigate(['register-vessel',this.id])
  }
  addTrip(){
    this.router.navigate(['register-trip',this.id])
  }
  loadVessels(){
    this.enterpriseService.getVessels(this.id).subscribe({
      next:(dados)=> {
          this.vessels = dados;
      },error:(err)=>{
          console.log("Sem empresas",err)
          this.vessels = [];
      },
    })
  }
  loadTrips(){
    console.log("abriu")
    this.enterpriseService.getTrips(this.id).subscribe({
      next:(data)=> {
        console.log(data)
        this.trips = data;
      },error:(err)=> {
        this.trips = []
      },
    })
  }
  select(event:any){

  }
  selectTrip(event:any){

  }
  editVessel(id:number){
    this.router.navigate(['edit-vessel',id])
  }
  delVessel(id:number){
    this.vesselService.del(id).subscribe({
      next:(dados)=>{
        alert("Embarcação deletada com Sucesso")
      },
      error:(err)=>{
        alert("Falha ao deletar embarcação");
        console.log("falha ao deletar:",err);
      }
    });
  }
  editTrip(id:number){

  }
  delTrip(id:number){

  }
}
