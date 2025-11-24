import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-city',
  imports: [],
  templateUrl: './card-city.html',
  styleUrl: './card-city.scss',
})
export class CardCity {
  @Input()
  image!:string

  @Input()
  name!:string
}
