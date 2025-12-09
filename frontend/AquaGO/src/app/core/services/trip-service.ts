import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token-service';
import { Observable } from 'rxjs';
import { trip } from '../../shared/models/trip';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  caminho = environment.apiUrl;
  API = `${this.caminho}/api/trips/`;

  constructor (
    private http:HttpClient,
    private token:TokenService){}

  add(data: trip): Observable<trip> {
    const formData = toFormData(data);
    const headers = this.token.getAuthHeaders();
    return this.http.post<trip>(this.API, formData,{headers});
  }
}