import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { CommonModule } from '@angular/common';
import { customUser } from '../../../shared/models/customUser';

@Component({
  selector: 'app-nav',
  imports: [CustomButton,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {

  @Input()
  logado!:boolean

  @Input()
  user!:customUser;
  //inserir o tipo usuário e depois passar os dados dele aqui

  constructor(private router:Router){}
  
  home(){
    this.router.navigate(['home'])
  }
}
