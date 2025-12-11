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
import { TripSegmentService } from '../../core/services/trip_segments-service';
import { CityService } from '../../core/services/city-service';
import { Logos } from '../../shared/components/logos/logos';
import { CommonModule } from '@angular/common';   
import { FormsModule } from '@angular/forms';    
import { TripSegment } from '../../shared/models/tripSegment';
import { TripSegmentCard } from '../../shared/components/trip-segment-card/trip-segment-card';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-home',
  imports: [TripSegmentCard, CustomInput, CardCity, CardEnterprise, CustomButton, Nav, Footer, Logos, CommonModule, FormsModule],
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
    const toastEl = document.getElementById('mainToast');
    if (toastEl) {
      const toast = new Toast(toastEl);
      toast.show();
    }
  }
  user:customUser = new customUser();
  enterprises:enterprise[] = [];
  cities: City[] = [];
  tripSegments: TripSegment[] = [];

  selectedDepartureCity: number | null = null;
  selectedArrivalCity: number | null = null;
  selectedDate: string | null = '2025-05-20';

  constructor(
    private router: Router,
    private enterpriseService:EnterpriseService,
    private cityService:CityService,
    private tripSegmentService:TripSegmentService){

  }
  ngOnInit() {
    this.enterpriseService.getAll().subscribe({
        next:(dados)=> {
          this.enterprises = Array.isArray(dados) ? dados : [];
        }
      }
    )
    this.cityService.getAll().subscribe({
      next:(dados)=>{
        this.cities = Array.isArray(dados) ? dados : [];
      }
    })
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


  convertDate(brDate: string | null): string | null {
      if(!brDate) return null;

      const [day, month, year] = brDate.split('/')
      if(!day || !month || !year) return null;

      return `${year}-${month}-${day}`;
  }

  search() {

    this.tripSegmentService
      .search(this.selectedDepartureCity, this.selectedArrivalCity, this.selectedDate)
      .subscribe({
        next: (dados) => {
          this.tripSegments = Array.isArray(dados) ? dados : [];

          if (this.tripSegments.length === 0) {
            alert("Não há viagens condizentes com o que foi repassado.");
          }
        },

      error: (err) => {
        if (err.status === 400) {
          alert("Todos os campos devem ser preenchidos corretamente.");
        } else {
          alert("Ocorreu um erro inesperado ao buscar viagens.");
        }

        console.error(err);
      }
    });
  }
}