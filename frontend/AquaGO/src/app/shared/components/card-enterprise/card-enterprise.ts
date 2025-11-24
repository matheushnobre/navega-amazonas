import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-card-enterprise',
  imports: [],
  templateUrl: './card-enterprise.html',
  styleUrl: './card-enterprise.scss',
})
export class CardEnterprise {
  @Input()
  path = "assets/icon";

  @Input()
  url!:string;

  @Input()
  title!:string;

  @Input()
  text!:string;
}
