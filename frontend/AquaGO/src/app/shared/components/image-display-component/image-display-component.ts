import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-display-component',
  imports: [],
  templateUrl: './image-display-component.html',
  styleUrl: './image-display-component.scss',
})
export class ImageDisplayComponent implements OnChanges{
  @Input()
  src: string | File | null = null;
  imageUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['src']){
        this.resolveImage();
      }
  }
  private resolveImage(){
    if(!this.src){
      this.imageUrl = null;
      return;
    }
    if(this.src instanceof File){
      const reader = new FileReader();
      reader.onload = () => this.imageUrl = reader.result as string;
      reader.readAsDataURL(this.src);
      return;
    }
    if(typeof this.src === 'string'){
      this.imageUrl = this.src;
      return;
    }
  }
}
