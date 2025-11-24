import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  imports: [],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
})
export class CustomInput {
  @Input()
  type: "text" | "email" | "number"| "date"  = "text";
  @Input()
  type_input: "standard" | "date" | "person" = "standard";
  @Input()
  placeholder!:string

}
