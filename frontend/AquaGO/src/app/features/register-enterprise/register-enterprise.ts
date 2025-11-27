import { Component } from '@angular/core';
import { Nav } from "../../core/components/nav/nav";
import { CustomInput } from "../../shared/components/custom-input/custom-input";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { Footer } from "../../core/components/footer/footer";

@Component({
  selector: 'app-register-enterprise',
  imports: [Nav, CustomInput, CustomButton, Footer],
  templateUrl: './register-enterprise.html',
  styleUrl: './register-enterprise.scss',
})
export class RegisterEnterprise {

}
