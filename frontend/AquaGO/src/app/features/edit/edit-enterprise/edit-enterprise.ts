import { Component } from '@angular/core';
import { EnterpriseService } from '../../../core/services/enterprise-service';
import { UserService } from '../../../core/services/user-service';
import { Location } from '@angular/common';
import { enterprise } from '../../../shared/models/enterprise';
import { Nav } from "../../../core/components/nav/nav";
import { ImgInput } from "../../../shared/components/img-input/img-input";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { Footer } from "../../../core/components/footer/footer";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-enterprise',
  imports: [Nav, ImgInput, CustomInput, CustomButton, Footer],
  templateUrl: './edit-enterprise.html',
  styleUrl: './edit-enterprise.scss',
})
export class EditEnterprise {
  
  id!:number;

  enterprise:enterprise = {
    fantasy_name:"",
    image: "",
  };

  constructor(
    private enterpriseService:EnterpriseService,
    private location:Location,
    private activatedRoute:ActivatedRoute)
    {
      this.id=Number(this.activatedRoute.snapshot.paramMap.get('id'));    
      this.loadEnterprise();
  }
  onImagemSelecionada(file: File) {
    this.enterprise.image = file;
  }
  edit(event:Event){
    event.preventDefault();
    if(!(this.enterprise instanceof File)){
      delete this.enterprise.image; 
    }
    this.enterpriseService.update(this.id,this.enterprise).subscribe({
      next:()=> {
          alert("Empresa editada com sucesso");
          this.location.back();
        },error(err) {
          console.log(err);
      },
    })
  }
  loadEnterprise(){
    this.enterpriseService.get(this.id).subscribe({
      next:(dados)=> {
          this.enterprise = dados;
      },error:(err) =>{
        this.location.back();
      },
    });
  }
}
