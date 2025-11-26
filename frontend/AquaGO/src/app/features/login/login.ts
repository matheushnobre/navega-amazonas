import { Component } from '@angular/core';
import { CustomInput } from "../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-login',
  imports: [CustomInput, CustomButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  login: false | true = true;

  reverse(){
    this.login=!this.login;
  }
}
