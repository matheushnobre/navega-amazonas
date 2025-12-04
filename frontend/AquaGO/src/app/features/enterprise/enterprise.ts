import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { Footer } from "../../core/components/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { vessel } from '../../shared/models/vessel';
import { ActivatedRoute, Router } from '@angular/router';
import { VesselService } from '../../core/services/vessel-service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-enterprise',
  imports: [Nav, Footer, CustomButton],
  templateUrl: './enterprise.html',
  styleUrl: './enterprise.scss',
})
export class Enterprise {
  vessels:vessel [] = [];
  id!:number;
  //preciso mandar o id da empresa

  constructor(private router:Router,
    private activatedRoute:ActivatedRoute,
    private vesselService:VesselService){
      this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.load();
  }
  adicionar(){
    this.router.navigate(['register-vessel',this.id])
  }
  load(){
    this.vesselService.get().subscribe({
      next:(dados)=> {
          this.vessels = dados;
      },error(err) {
          console.log("Sem empresas")
      },
    })
  }
  select(event:any){

  }
  edit(id:number){

  }
  del(id:number){

  }
}
