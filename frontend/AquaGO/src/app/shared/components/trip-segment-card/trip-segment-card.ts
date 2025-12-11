import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TripSegment } from '../../models/tripSegment';
import { Harbor } from '../../models/harbor';
import { vessel } from '../../models/vessel';
import { CustomButton } from "../custom-button/custom-button";

@Component({
  selector: 'app-trip-segment-card',
  standalone: true,
  imports: [DatePipe, CustomButton],
  templateUrl: './trip-segment-card.html',
  styleUrls: ['./trip-segment-card.scss']
})
export class TripSegmentCard {
  @Input() segment!: TripSegment;

  @Input() buyRoute: string = '/'; // rota padrão

  constructor(private router: Router) {}

  buy() {
    this.router.navigate([this.buyRoute]);
  }
  getHarborName(harbor: number | Harbor | null | undefined): string {
    return harbor && typeof harbor === 'object' ? harbor.name : '';
  }
  getVesselName(vessel: number | vessel | null | undefined): string {
    return vessel && typeof vessel === 'object' ? vessel.name : '';
  }
}
