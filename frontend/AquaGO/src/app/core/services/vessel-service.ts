import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { vessel } from '../../shared/models/vessel';
import { Observable } from 'rxjs';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})
export class VesselService {
  
  caminho = environment.apiUrl;
  API = `${this.caminho}/api/vessels/`;

  constructor (
    private http:HttpClient,
    private token:TokenService){}

  add(data: vessel): Observable<vessel> {
    const formData = toFormData(data);
    const headers = this.token.getAuthHeaders();
    return this.http.post<vessel>(this.API, formData,{headers});
  }
  get(id:number):Observable<vessel>{
      const headers = this.token.getAuthHeaders();
      return this.http.get<vessel>(`${this.API}${id}`,{headers});
  }
  del(id:number){
    const headers = this.token.getAuthHeaders();
    return this.http.delete(`${this.API}${id}/`,{headers});
  }
  update(id:number,data:vessel):Observable<vessel>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(data);
    return this.http.patch<vessel>(`${this.API}${id}/`,formData,{headers});
  }
}
