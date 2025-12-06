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
  name:string = "";
  image:File | null = null;
  registry_code:string = "";
  individual_capacity:number = 0;
  enterprise!:enterprise | number;
  number_of_cabins:number = 0;
  opt:string = "barco";
  id!:number

  constructor(
    private vesselService:VesselService,
    private location:Location,
    private activatedRoute:ActivatedRoute){
    this.loadUser();

  }
  onImagemSelecionada(file: File) {
    this.image = file;
  }
  register(event:Event){
    event.preventDefault();


    const vessel:vessel = {
      image: this.image,
      individual_capacity: this.individual_capacity,
      name: this.name,
      registry_code:this.registry_code,
      number_of_cabins: this.number_of_cabins,
      enterprise: this.id,
      vessel_type: this.opt
    }

    this.vesselService.add(vessel).subscribe({
      next(value) {
          alert('Embarcação Cadastrada com sucesso');
      },
    })
    
  }
  loadUser(){
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  }
  onSelect(event:any){
    this.opt = event.target.value;
  }
}

