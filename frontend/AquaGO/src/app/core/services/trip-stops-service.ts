import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { TripStop } from '../../shared/models/tripStop';
import { Observable } from 'rxjs';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})
export class TripStopsService {
  
  apiURL = environment.apiUrl;
  API = `${this.apiURL}/api/trip_segments/`;
  constructor(private token:TokenService,private http:HttpClient){}

  add(dados: TripStop):Observable<TripStop>{
      const headers = this.token.getAuthHeaders();
      const formData = toFormData(dados);
      return this.http.post<TripStop>(`${this.API}`,formData,{headers});
    }
}
