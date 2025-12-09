import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  
  lucas(){
    window.open("https://www.linkedin.com/in/lucas-devstudies");
  }
  theus(){
    window.open("https://www.linkedin.com/in/matheushnobre/");
  }
  robby(){
    window.open("https://www.linkedin.com/in/robert-marialva-cruz-55240a335/")
  }
}
