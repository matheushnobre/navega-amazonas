import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Nav } from '../../../core/components/nav/nav';
import { ImgInput } from '../../../shared/components/img-input/img-input';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { Footer } from '../../../core/components/footer/footer';
import { enterprise } from '../../../shared/models/enterprise';
import { VesselService } from '../../../core/services/vessel-service';
import { vessel } from '../../../shared/models/vessel';

@Component({
  selector: 'app-register-vessel',
  imports: [Nav, ImgInput, CustomInput, CustomButton, Footer],
  templateUrl: './register-vessel.html',
  styleUrl: './register-vessel.scss',
})
export class RegisterVessel {

  vessel: vessel = {
    name:"",
    image: null,
    registry_code:"",
    individual_capacity:0,
    number_of_cabins: 0,
    vessel_type:"barco"
  }
  id!:number

  constructor(
    private vesselService:VesselService,
    private location:Location,
    private activatedRoute:ActivatedRoute){
    this.loadUser();

  }
  onImagemSelecionada(file: File) {
    this.vessel.image = file;
  }
  register(event:Event){
    event.preventDefault();
    if(!(this.vessel.image instanceof File)){
      delete this.vessel.image;
    }
    this.vesselService.add(this.vessel).subscribe({
      next:(value)=>{
          alert('Embarcação Cadastrada com sucesso');
          this.location.back();
        },error:(err)=> {
            alert('Falha ao Cadastrar Embarcação')
        },
    })
  }
  loadUser(){
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  }
  onSelect(event:any){
    this.vessel.vessel_type = event.target.value;
  }
}

