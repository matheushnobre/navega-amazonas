import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { City } from '../../shared/models/city';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { CardCity } from "../../shared/components/card-city/card-city";
import { CardEnterprise } from "../../shared/components/card-enterprise/card-enterprise";
import { CustomButton } from "../../shared/components/custom-button/custom-button";

@Component({
  selector: 'app-home',
  imports: [CustomInput, CardCity, CardEnterprise, CustomButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit{
  @ViewChild('scrollContainer')
  scrollContainer!: ElementRef<HTMLDivElement>;

  //Tratar pra não receber negativos em input
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  cities:City[] = []
  city1:City = new City();
  city2:City = new City();
  city3:City = new City();
  constructor(){
    this.city1.name = "Amazonas";
    this.city1.image = "parintins.png";

    this.city2.name = "Amazonas";
    this.city2.image = "manaus.png";
    
    this.city3.name = "Humaitá";
    this.city3.image = "humaita.png";
    
    this.cities.push(this.city1);
    this.cities.push(this.city2);
    this.cities.push(this.city3);
    this.cities.push(this.city1);
  }
  ngAfterViewInit(): void {
    const container = this.scrollContainer.nativeElement;

    container.addEventListener('mousedown', (e) => {
      this.isDown = true;
      container.classList.add('active');
      this.startX = e.pageX - container.offsetLeft;
      this.scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      this.isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      this.isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 1;
      container.scrollLeft = this.scrollLeft - walk;
    });
  }
}