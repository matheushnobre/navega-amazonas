import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {

  @Input()
  logado!:boolean

  @Input()
  user!:string;
  //inserir o tipo usuário e depois passar os dados dele aqui
}
