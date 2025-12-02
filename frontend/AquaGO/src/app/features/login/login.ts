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
  
  email: string = "";
  password: string = "";

  constructor(
    private auth: Auth,
    private router: Router,
    private user: UserService
  ) {}

  confirmar(event:Event) {
    event.preventDefault();
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access);
        this.router.navigate(['home']);
      },
      error: (err) => {
        alert("Erro ao logar");
        console.log("Erro de login:", err);
      }
    });
  }
  reverse(){
    this.router.navigate(['register'])
  }
}