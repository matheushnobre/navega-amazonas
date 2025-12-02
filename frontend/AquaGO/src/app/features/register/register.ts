import { Component } from '@angular/core';
import { CustomInput } from "../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { customUser } from '../../shared/models/customUser';
import { UserService } from '../../core/services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CustomInput, CustomButton],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  
  name: string = "";
  email: string = "";
  password: string = "";
  cpf: string = "";

  constructor(
    private router: Router,
    private user: UserService
  ) {}


  confirmar(event:Event) {
    event.preventDefault();
    const custom: customUser = {
        name: this.name,
        email: this.email,
        username: this.email,
        cpf: this.cpf,
        password: this.password
      };

      this.user.add(custom).subscribe({
        next: (dados) => {
          alert(`Usuário ${dados.name} cadastrado!`);
          this.router.navigate(['home'])
          
        },
        error: (err) => {
          console.log("Erro ao cadastrar:", err);
        }
    });
  }
  reverse(){
    this.router.navigate(['login'])
  }
}
