import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { CommonModule } from '@angular/common';
import { customUser } from '../../../shared/models/customUser';
import { enterprise } from '../../../shared/models/enterprise';
import { Enterprise } from '../../../features/enterprise/enterprise';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-nav',
  imports: [CustomButton,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnChanges {

  @Input()
  logado:boolean = false;

  enterprises:Enterprise[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.verificarUsuario();
  }

  constructor(private router:Router,private userService: UserService){}

  verificarUsuario(){
    this.userService.my_enterprises().subscribe({
      next:dados=>{
        this.enterprises = Array.isArray(dados) ? dados : [];
        alert(this.enterprises);
        this.logado = true;
      },error(err) {
          //Sem login
      },
    })
    //
  }
  home(){
    this.router.navigate(['home'])
  }
}
