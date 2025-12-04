import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-img-input',
  imports: [],
  templateUrl: './img-input.html',
  styleUrl: './img-input.scss',
})
export class ImgInput {
  @Input() startImage: string | File | null = null;
  @Output() fileSelected = new EventEmitter<File>();
  backgroundImage: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (this.startImage instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundImage = reader.result as string;
      };
      reader.readAsDataURL(this.startImage);
    } else {
      this.backgroundImage = this.startImage!;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.backgroundImage = reader.result as string;
        this.fileSelected.emit(file);
      };

      reader.readAsDataURL(file);
    }
  }
}
