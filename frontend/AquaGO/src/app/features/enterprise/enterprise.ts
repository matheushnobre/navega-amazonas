import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { Footer } from "../../core/components/footer/footer";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { vessel } from '../../shared/models/vessel';

@Component({
  selector: 'app-enterprise',
  imports: [Nav, Footer, CustomButton],
  templateUrl: './enterprise.html',
  styleUrl: './enterprise.scss',
})
export class Enterprise {
  user:customUser = new customUser();
  vessels:vessel [] = [];
  vel:vessel = new vessel();
  //preciso mandar o id da empresa

  constructor(){
    this.vel.image = ""
    this.vel.name = "Ajato Aliança"
  }
}
