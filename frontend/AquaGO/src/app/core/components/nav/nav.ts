import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/user-service';
import { TokenService } from '../../services/token-service';
import { catchError, of } from 'rxjs';
import { enterprise } from '../../../shared/models/enterprise';
import { Auth } from '../../auth/auth';
import { customUser } from '../../../shared/models/customUser';

@Component({
  selector: 'app-nav',
  imports: [CustomButton,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {

  logado:boolean = false;

  user:customUser = new customUser();
  constructor(
    private router:Router,
    private userService: UserService,
    private tokenService: TokenService,
    private location: Location,
    private auth:Auth
  ){}
  ngOnInit() {
    this.verificarUsuario();
  }

  verificarUsuario() {
  if (!this.tokenService.isTokenValid()) {
    let token = this.tokenService.getToken();
    this.auth.refresh(token!).subscribe({
        next:(value)=> {
            this.logado = true;
            localStorage.setItem('token', value.access);
        },
        error:(err)=> {
            this.logado = false;
        },
    });
    this.user.enterprises = [];
    return;
  }else{
    this.logado=true;
  }

  this.userService.me()
    .pipe(
      catchError(err => {
        this.user.enterprises = [];
        return of([]);
      })
    )
    .subscribe(dados => {
      this.user = dados as customUser;
      if (!this.user.enterprises){
        this.user.enterprises = [];
      }
    });
  }


  login() {
    this.router.navigate(['login']);
  }

  home() {
    this.router.navigate(['home']);
  }

  create() {
    this.router.navigate(['register']);
  }
  exit(){
    this.tokenService.logout();
    this.location.go(this.location.path());
    window.location.reload();
  }
}
