import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { enterprise } from '../../shared/models/enterprise';
import { ListEnterprise } from "../../shared/components/list-enterprise/list-enterprise";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { Footer } from "../../core/components/footer/footer";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [Nav, ListEnterprise, CustomButton, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  user: customUser = new customUser();
  enterprise1: enterprise = new enterprise();
  enterprise2: enterprise = new enterprise();
  lista:enterprise[] = [];

  constructor(private router:Router){
    this.user.username="Cleito"
    this.enterprise1.image="./assets/saphira.jpg";
    this.enterprise1.fantasy_name="Safira";
    this.enterprise1.id=1;
    this.enterprise1.cnpj="1123123";
    this.enterprise2.cnpj="1213123";
    this.enterprise2.id=2;
    this.enterprise2.image="./assets/parintins.jpg";
    this.enterprise2.fantasy_name="Parintins";
    this.lista.push(this.enterprise1);
    this.lista.push(this.enterprise2);
    this.user.enterprises=this.lista;
  }
  select(id:number){
    this.router.navigate(['enterprise',id]);
  }
}
