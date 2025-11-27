import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { CommonModule } from '@angular/common';
import { customUser } from '../../../shared/models/customUser';
import { enterprise } from '../../../shared/models/enterprise';

@Component({
  selector: 'app-nav',
  imports: [CustomButton,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnChanges {

  @Input()
  logado!:boolean

  @Input()
  user:customUser = new customUser();
  enterprise:boolean = false;
  enter:enterprise [] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.verificarUsuario();
  }


  constructor(private router:Router){}

  verificarUsuario(){
    try{
      if(this.user.enterprises.length>0){
        this.enterprise = true;
      }
    }
    catch{
      this.enterprise=false;
    }
  }
  home(){
    this.router.navigate(['home'])
  }
}
