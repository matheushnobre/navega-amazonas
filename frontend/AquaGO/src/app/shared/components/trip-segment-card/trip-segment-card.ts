import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TripSegment } from '../../models/tripSegment';
import { Harbor } from '../../models/harbor';
import { vessel } from '../../models/vessel';

@Component({
  selector: 'app-trip-segment-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './trip-segment-card.html',
  styleUrls: ['./trip-segment-card.scss']
})
export class TripSegmentCard {
  @Input() segment!: TripSegment;

  @Input() buyRoute: string = '/'; // rota padrão

  constructor(private router: Router) {}

  buy() {
    alert("comprar");
    this.router.navigate([this.buyRoute]);
  }
  getHarborName(harbor: number | Harbor | null | undefined): string {
    return harbor && typeof harbor === 'object' ? harbor.name : '';
  }
  getVesselName(vessel: number | vessel | null | undefined): string {
    return vessel && typeof vessel === 'object' ? vessel.name : '';
  }

}
