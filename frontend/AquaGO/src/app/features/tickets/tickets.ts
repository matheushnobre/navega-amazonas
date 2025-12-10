import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../shared/models/ticket';
import { environment } from '../../../environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { Nav } from '../../core/components/nav/nav';
import { Footer } from '../../core/components/footer/footer';
import { TripSegment } from '../../shared/models/tripSegment';
import { DatePipe } from '@angular/common';
import { Vessel } from '../vessel/vessel';
import { Harbor } from '../../shared/models/harbor';
import { TicketService } from '../../core/services/ticket-service';

@Component({
  selector: 'app-tickets',
  imports: [Nav, Footer, DatePipe],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets implements OnInit {
  tickets: Ticket[] = [];
  path = environment.apiUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private ticketService: TicketService
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

  pay(ticket_id: number) {
    console.log(ticket_id);
    this.ticketService.get_payment_link(ticket_id).subscribe({
      next: (res) => {
        window.location.href = res.link; 
      },
      error: (err) => {
        console.error("Erro ao gerar link de pagamento:", err);
      }
    });
  }
  
  getHarborName(harbor: number | Harbor | null | undefined): string {
    return harbor && typeof harbor === 'object' ? harbor.name : '';
  }

}
