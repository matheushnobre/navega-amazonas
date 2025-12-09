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
import { Harbor } from '../../shared/models/harbor';

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
        const seg = this.segment;

        if (!seg || !seg.from_stop || !seg.to_stop) {
          alert("Erro: dados da viagem incompletos.");
          return;
        }

        const fromHarbor =
          seg.from_stop.harbor && typeof seg.from_stop.harbor === 'object'
            ? seg.from_stop.harbor.name
            : "(porto indefinido)";

        const toHarbor =
          seg.to_stop.harbor && typeof seg.to_stop.harbor === 'object'
            ? seg.to_stop.harbor.name
            : "(porto indefinido)";

        alert(`Passagem reservada e pendente de pagamento. ${fromHarbor} → ${toHarbor}`);

        this.router.navigate(['/']);
      }

      ,
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
  getHarborName(harbor: number | Harbor | null | undefined): string {
    return harbor && typeof harbor === 'object' ? harbor.name : '';
  }

}
