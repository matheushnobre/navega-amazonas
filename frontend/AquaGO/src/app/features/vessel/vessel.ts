import { Component } from '@angular/core';
import { Footer } from "../../core/components/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { Nav } from "../../core/components/nav/nav";
import { vessel } from '../../shared/models/vessel';
import { trip } from '../../shared/models/trip';
import { TripService } from '../../core/services/trip-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vessel',
  imports: [Footer, CustomButton, Nav],
  templateUrl: './vessel.html',
  styleUrl: './vessel.scss',
})
export class Vessel {
  
  id!:number;
  trip:trip = new trip();
  
  constructor(
    private tripService:TripService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ){
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.load();
  }

  add(){
    this.router.navigate(['register-trip-segment',this.id]);
  }
  edit(id:number){
  }
  del(id:number){
  }
  load(){
    this.tripService.getAll(this.id).subscribe({
      next:(data)=> {
        this.trip = data;
      },
    });
  }
}
