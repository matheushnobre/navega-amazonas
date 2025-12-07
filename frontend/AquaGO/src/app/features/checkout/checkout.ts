import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TripSegmentService } from '../../core/services/trip_segments-service';
import { UserService } from '../../core/services/user-service';
import { TripSegment } from '../../shared/models/tripSegment';
import { customUser } from '../../shared/models/customUser';
import { DatePipe } from '@angular/common';
import { Nav } from '../../core/components/nav/nav';
import { TicketService } from '../../core/services/ticket-service';
import { Ticket } from '../../shared/models/ticket';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
  imports: [DatePipe, Nav]
})

export class Checkout implements OnInit {
  segmentId!: number;
  segment: TripSegment | null = null;
  user: customUser | null = null;
  loading = true;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripSegmentService: TripSegmentService,
    private userService: UserService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.segmentId = Number(this.route.snapshot.paramMap.get('id'));

    // Verificar usuário logado
    this.userService.get_security().subscribe({
      next: (data) => {
        this.user = data;
        this.loadSegment();
      },
      error: () => {
        // Não logado → redireciona para login
        this.router.navigate(['/login']);
      }
    });

    this.tripSegmentService.get(this.segmentId).subscribe({
      next: (data) => {
        this.segment = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar o segmento.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadSegment() {
   
  }

  confirmPurchase() {
    if (!this.segment?.id) {
      alert('Rota não carregada.');
      return;
    }

    if(!this.user?.id){
      alert("User não carregado");
      return;
    }

    const ticket: Ticket = new Ticket();
    ticket.passenger = this.user.id;
    ticket.trip_segment = this.segment.id;

    console.log(ticket)
    this.ticketService.add(ticket).subscribe({
      next: () => {
        alert(`Passagem reservada e pendente de pagamento. ${this.segment?.from_stop?.harbor?.name} → ${this.segment?.to_stop?.harbor?.name}`);
        this.router.navigate(['/']); // volta para home, mas assim que eu fizer certinho vai levar pro historico do passageiro pra de la ele poder pagar a passagem
      },
      error: (err) => {
        const backend = err.error;
        
        const detail = Array.isArray(backend?.detail) ? backend.detail[0]: backend?.detail;

        if(detail === "Exceed capacity."){
          alert("Não há mais passagens disponíveis neste trecho.");
          this.router.navigate(['/']); 
        } else{
          alert('Erro ao reservar a passagem. Tente novamente.');
        }
      }
    });
  }


  cancel() {
    this.router.navigate(['/']); // volta para home
  }
}
