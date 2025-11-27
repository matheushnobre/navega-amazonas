import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  imports: [],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
})
export class CustomInput {
  @Input()
  type: "text" | "email" | "number"| "date" | "password" | "file"  = "text";
  @Input()
  type_input: "standard" | "email" | "date" | "person" | "password" | "file" = "standard";
  @Input()
  placeholder!:string

}
