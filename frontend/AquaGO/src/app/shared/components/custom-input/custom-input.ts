import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomInputValue } from '../../types/input';

@Component({
  selector: 'app-custom-input',
  imports: [],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.scss',
})
export class CustomInput {
  @Input()
  type: "text" | "email" | "number"| "date" | "password" | "file" | "time" = "text";
  @Input()
  type_input: "standard" | "email" | "date" | "person" | "password" | "file" = "standard";
  @Input()
  placeholder!:string
  @Input()
  value:CustomInputValue | null = null;

  @Output() valueChange = new EventEmitter<CustomInputValue>();
  
  onInputChange(event:any){
    let value:CustomInputValue;

    if (this.type === 'file') {
      value = event.target.files[0];
    } else if (this.type === 'number') {
      value = Number(event.target.value);
    } else if (this.type === 'date') {
      value = event.target.value;
    } else{
      value = event.target.value;
    }
    this.valueChange.emit(value);
  }
  blockKeyboard(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
