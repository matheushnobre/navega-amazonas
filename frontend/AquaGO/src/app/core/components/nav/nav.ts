import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomButton } from "../../../shared/components/custom-button/custom-button";
import { CommonModule, Location } from '@angular/common';
import { Enterprise } from '../../../features/enterprise/enterprise';
import { UserService } from '../../services/user-service';
import { TokenService } from '../../services/token-service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [CustomButton,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {

  logado:boolean = false;

  enterprises:Enterprise[] = [];

  constructor(
    private router:Router,
    private userService: UserService,
    private tokenService: TokenService,
    private location: Location
  ){}
  ngOnInit() {
    this.verificarUsuario();
  }

  verificarUsuario() {
  const token = this.tokenService.getToken();

  if (!token) {
    this.logado = false;
    this.enterprises = [];
    return;
  }

  this.userService.my_enterprises()
    .pipe(
      catchError(err => {
        this.logado = true;
        this.enterprises = [];
        return of([]);
      })
    )
    .subscribe(dados => {
      this.logado = true; 
      this.enterprises = Array.isArray(dados) ? dados : [];
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
