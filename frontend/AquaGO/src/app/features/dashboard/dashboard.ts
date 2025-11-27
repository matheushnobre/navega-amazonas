import { Component } from '@angular/core';
import { customUser } from '../../shared/models/customUser';
import { Nav } from "../../core/components/nav/nav";
import { enterprise } from '../../shared/models/enterprise';
import { ListEnterprise } from "../../shared/components/list-enterprise/list-enterprise";

@Component({
  selector: 'app-dashboard',
  imports: [Nav, ListEnterprise],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  user: customUser = new customUser();
  enterprise1: enterprise = new enterprise();
  enterprise2: enterprise = new enterprise();
  lista:enterprise[] = [];

  constructor(){
    this.user.username="Cleito"
    this.enterprise1.image="./assets/icons/cities.svg";
    this.enterprise1.fantasy_name="lancha Safira";
    this.enterprise2.image="./assets/icons/enterprise.svg";
    this.enterprise2.fantasy_name="Barco estrelinha";
    this.lista.push(this.enterprise1);
    this.lista.push(this.enterprise2);
    this.user.enterprises=this.lista;
  }
}
