import { Component } from '@angular/core';
import { CustomInput } from "../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { Auth } from '../../core/auth/auth';
import { customUser } from '../../shared/models/customUser';

@Component({
  selector: 'app-login',
  imports: [CustomInput, CustomButton,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  name: string = "";
  email: string = "";
  password: string = "";
  cpf: string = "";
  login: boolean = true;

  constructor(
    private auth: Auth,
    private router: Router,
    private user: UserService
  ) {}

  reverse() {
    this.login = !this.login;
  }

  confirmar(event:Event) {
    if (this.login) {
      event.preventDefault();
      this.auth.login(this.email, this.password).subscribe({
        next: (res) => {
          alert(res);
          localStorage.setItem('token', res.access);
          //this.router.navigate(['/home']);
        },
        error: (err) => {
          alert("Erro ao logar");
          console.log("Erro de login:", err);
        }
      });
    } else {
      const custom: customUser = {
        name: this.name,
        email: this.email,
        username: this.email,
        cpf: this.cpf,
        password: this.password
      };
      alert(this.name);

      this.user.add(custom).subscribe({
        next: (dados) => {
          alert(`Usuário ${dados.name} cadastrado!`);
        },
        error: (err) => {
          console.log("Erro ao cadastrar:", err);
        }
      });
    }
  }
}