import { Component } from '@angular/core';
import { Nav } from "../../../core/components/nav/nav";
import { ImgInput } from "../../../shared/components/img-input/img-input";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { Footer } from "../../../core/components/footer/footer";
import { VesselService } from '../../../core/services/vessel-service';
import { ActivatedRoute } from '@angular/router';
import { vessel } from '../../../shared/models/vessel';
import { FormsModule } from "@angular/forms";
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-vessel',
  imports: [Nav, ImgInput, CustomInput, CustomButton, Footer, FormsModule],
  templateUrl: './edit-vessel.html',
  styleUrl: './edit-vessel.scss',
})
export class EditVessel {
  vessel: vessel = {
    name: "",
    image: null,
    registry_code: "",
    individual_capacity: 0,
    number_of_cabins:0,   
    vessel_type: "" 
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
  edit(event:Event){
    event.preventDefault();
    alert(this.vessel.vessel_type)
    if(!(this.vessel.image instanceof File)){
      delete this.vessel.image;
    }
    if(this.vessel.vessel_type=="BOAT"){
      this.vessel.vessel_type = "BARCO";
    }else{
      this.vessel.vessel_type = "LANCHA";
    }
    this.vesselService.update(this.id,this.vessel).subscribe({
      next:(value)=> {
          alert('Embarcação Editada com sucesso');
          this.location.back();
      },error:(value)=>{
        alert('Erro ao cadastrar embarcação');
        console.log(value);
      }
    })
    
  }
  loadUser(){
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.vesselService.get(this.id).subscribe({
      next:(value)=>{
          console.log("Embarcação carregada");
          this.vessel = value;
      },error:(err)=>{
          console.log("Falha ao carregar embarcação")
          this.location.back();
      }
    })
  }
  onSelect(event:any){
    this.vessel.vessel_type = event.target.value;
  }
}

