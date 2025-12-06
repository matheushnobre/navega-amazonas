import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { TripSegment } from '../../shared/models/tripSegment';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})

export class TripSegmentService {
  
  apiURL = environment.apiUrl;
  API = `${this.apiURL}/api/trip_segments/`;
  constructor(private token:TokenService,private http:HttpClient){}

  getAll():Observable<TripSegment[]>{
    return this.http.get<TripSegment[]>(`${this.API}`);
  }

  get(id:number):Observable<TripSegment>{
    const headers = this.token.getAuthHeaders();
    return this.http.get<TripSegment>(`${this.API}${id}`,{headers});
  }

  search(cityFrom: number|null, cityTo: number|null, date: string|null): Observable<TripSegment> {
    return this.http.get<TripSegment>(
      `${this.API}from_to/?departure_city=${cityFrom}&arrival_city=${cityTo}&date=${date}`
    );
  }

}
