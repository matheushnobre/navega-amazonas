import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../shared/models/ticket';
import { environment } from '../../../environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { Nav } from '../../core/components/nav/nav';
import { CustomButton } from '../../shared/components/custom-button/custom-button';
import { Footer } from '../../core/components/footer/footer';
import { TripSegment } from '../../shared/models/tripSegment';
import { DatePipe } from '@angular/common';
import { Vessel } from '../vessel/vessel';

@Component({
  selector: 'app-tickets',
  imports: [Nav, CustomButton, Footer, DatePipe],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets implements OnInit {
  tickets: Ticket[] = [];
  path = environment.apiUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserTickets();
  }

  loadUserTickets(): void {
    this.userService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Erro ao carregar tickets do usuário:', err);
      }
    });
  }

  goToTicket(ticket: Ticket): void {
    this.router.navigate(['/ticket', ticket.id]);
  }

  select(event:any){

  }

  isTripSegment(value: any): value is TripSegment {
    return value && typeof value === 'object';
  }

  pay(ticket_id: number){
    
  }
}
