import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { City } from '../../shared/models/city';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { CardCity } from "../../shared/components/card-city/card-city";
import { CardEnterprise } from "../../shared/components/card-enterprise/card-enterprise";
import { CustomButton } from "../../shared/components/custom-button/custom-button";
import { Nav } from "../../core/components/nav/nav";
import { Footer } from '../../core/components/footer/footer';
import { Router } from '@angular/router';
import { customUser } from '../../shared/models/customUser';
import { enterprise } from '../../shared/models/enterprise';
import { EnterpriseService } from '../../core/services/enterprise-service';
import { Logos } from '../../shared/components/logos/logos';

@Component({
  selector: 'app-home',
  imports: [CustomInput, CardCity, CardEnterprise, CustomButton, Nav, Footer, Logos],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnInit{
  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  ngAfterViewInit() {
    if (this.scrollContainers.length > 0) {
      this.configurarScroll();
    }

    this.scrollContainers.changes.subscribe(() => {
      this.configurarScroll();
    });
  }
  user:customUser = new customUser();
  enterprises:enterprise[] = [];
  cities:City[] = []
  city1:City = new City();
  city2:City = new City();
  city3:City = new City();
  city4:City = new City();
  constructor(
    private router: Router,
    private enterpriseService:EnterpriseService){

    this.city1.name = "Amazonas";
    this.city1.image = "parintins.png";

    this.city2.name = "Manaus";
    this.city2.image = "manaus.png";
    
    this.city3.name = "Humaitá";
    this.city3.image = "humaita.png";
    
    this.city4.name = "Itacoatiara";
    this.city4.image = "itacotiara.png";

    this.cities.push(this.city1);
    this.cities.push(this.city2);
    this.cities.push(this.city3);
    this.cities.push(this.city4);
  }
  ngOnInit() {
    this.enterpriseService.getAll().subscribe({
        next:(dados)=> {
          this.enterprises = Array.isArray(dados) ? dados : [];
        }
      }
    )
  }

  configurarScroll(){
    this.scrollContainers.forEach((containerRef: ElementRef) => {
    const container = containerRef.nativeElement;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    container.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      e.preventDefault();
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.style.cursor = 'grab';
    });

    container.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX;
      container.scrollLeft = scrollLeft - walk;
    });
  });
  }
  register(){
    this.router.navigate(['register-enterprise']);
  }
}