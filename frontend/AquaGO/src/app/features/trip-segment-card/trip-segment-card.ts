import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TripSegment } from '../../shared/models/tripSegment';
import { Router } from '@angular/router';
import { CustomButton } from '../../shared/components/custom-button/custom-button';

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
    console.log("comprar");
    this.router.navigate([this.buyRoute]);
  }
}
