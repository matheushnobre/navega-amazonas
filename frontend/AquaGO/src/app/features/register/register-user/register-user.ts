import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { CustomButton } from '../../../shared/components/custom-button/custom-button';
import { UserService } from '../../../core/services/user-service';
import { customUser } from '../../../shared/models/customUser';

@Component({
  selector: 'app-register-user',
  imports: [CustomInput, CustomButton],
  templateUrl: './register-user.html',
  styleUrl: './register-user.scss',
})
export class RegisterUser {

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
