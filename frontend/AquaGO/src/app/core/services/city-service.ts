import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { City } from '../../shared/models/city';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { toFormData } from '../utils/form-data';
import { Harbor } from '../../shared/models/harbor';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  
  apiURL = environment.apiUrl;
  API = `${this.apiURL}/api/cities/`;
  constructor(private token:TokenService,private http:HttpClient){}

  add(dados: City):Observable<City>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(dados);
    return this.http.post<City>(`${this.API}`,formData,{headers});
  }
  getAll():Observable<City[]>{
    return this.http.get<City[]>(`${this.API}`);
  }
  get(id:number):Observable<City>{
    const headers = this.token.getAuthHeaders();
    return this.http.get<City>(`${this.API}${id}`,{headers});
  }
  getHarbors(id:number):Observable<Harbor[]>{
    const headers = this.token.getAuthHeaders();
    return this.http.get<Harbor[]>(`${this.API}${id}/harbors/`,{headers});
  }
  update(id:number,dados:City):Observable<City>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(dados);
    return this.http.patch<City>(`${this.API}${id}/`,formData,{headers});
  }
  delete(id:number){
    //backend não tá deixando mexer
    const headers = this.token.getAuthHeaders();
    return this.http.delete(`${this.API}${id}/`,{headers});
  }
}
