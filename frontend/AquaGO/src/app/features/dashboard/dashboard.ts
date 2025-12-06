import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { enterprise } from '../../shared/models/enterprise';
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { Footer } from "../../core/components/footer/footer";
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { environment } from '../../../environments/environments';
import { EnterpriseService } from '../../core/services/enterprise-service';

@Component({
  selector: 'app-dashboard',
  imports: [Nav, CustomButton, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  user: customUser = new customUser();
  caminho:string = `${environment.apiUrl}`

  constructor(
    private router:Router,
    private userService:UserService,
    private enterpriseService:EnterpriseService
  ){
    this.loadUser();
  }
  select(id:number){
    this.router.navigate(['enterprise',id]);
  }
  loadUser(){
    this.userService.get_security().subscribe({
      next:(dados)=>{
        this.user = dados;
      },error(err) {
          console.log("Erro ao carregar dados de usuário");
      },
    })
  }
  add(){
    this.router.navigate(['register-enterprise'])
  }
  edit(id:number){
    this.router.navigate(['edit-enterprise',id]);
  }
  del(id:number){
    this.enterpriseService.delete(id).subscribe({
      next:(value) =>{
          alert("Empresa deletada com sucesso");
        },error:(err)=> {
          alert("Erro ao tentar deletar empresa");
          console.log("erro ao deletar:",err);
      },
    });
  }
}
