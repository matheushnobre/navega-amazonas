import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  imports: [NgClass],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.scss',
})
export class CustomButton {
  @Input()
  name!:string;

  @Input()
  variant: "light"| "light_outline" |"primary" = "primary";
}
