import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Ticket } from '../../shared/models/ticket';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  
  apiURL = environment.apiUrl;
  API = `${this.apiURL}/api/tickets/`;
  constructor(private token:TokenService,private http:HttpClient){}

  add(dados: Ticket):Observable<Ticket>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(dados);
    return this.http.post<Ticket>(`${this.API}`,formData,{headers});
  }

  get(id:number):Observable<Ticket>{
    const headers = this.token.getAuthHeaders();
    return this.http.get<Ticket>(`${this.API}${id}`,{headers});
  }

    get_payment_link(id: number): Observable<{ link: string }> {
      const headers = this.token.getAuthHeaders();
      return this.http.get<{ link: string }>(
        `${this.API}${id}/payment/`,
        { headers }
      );
    }
}
