import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Nav } from '../../../core/components/nav/nav';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { Footer } from '../../../core/components/footer/footer';
import { ImgInput } from '../../../shared/components/img-input/img-input';
import { EnterpriseService } from '../../../core/services/enterprise-service';
import { UserService } from '../../../core/services/user-service';
import { enterprise } from '../../../shared/models/enterprise';

@Component({
  selector: 'app-register-enterprise',
  imports: [Nav, CustomInput, CustomButton, Footer, ImgInput],
  templateUrl: './register-enterprise.html',
  styleUrl: './register-enterprise.scss',
})
export class RegisterEnterprise {  
  fantasy_name:string = "";
  image:File | null = null;
  cnpj:string = "";


  constructor(
    private enterpriseService:EnterpriseService,
    private userService:UserService,
    private location:Location){
    this.loadUser();

  }
  onImagemSelecionada(file: File) {
    this.image = file;
  }
  register(event:Event){
    event.preventDefault();
    const enterprise:enterprise = {
      fantasy_name: this.fantasy_name,
      cnpj:this.cnpj,
      image:this.image,
    };
    this.enterpriseService.add(enterprise).subscribe({
      next:(dados)=> {
          alert("Empresa cadastrada com sucesso");
          this.location.back();
        },error(err) {
          alert("Erro ao cadastrar");
      },
    })
  }
  loadUser(){
    this.userService.get_security
  }
}
