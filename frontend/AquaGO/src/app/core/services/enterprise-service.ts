import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { enterprise } from '../../shared/models/enterprise';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';
import { HttpClient } from '@angular/common/http';
import { toFormData } from '../utils/form-data';

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  
  apiURL = environment.apiUrl;
  API = `${this.apiURL}/api/enterprises/`;
  constructor(private token:TokenService,private http:HttpClient){}

  add(dados: enterprise):Observable<enterprise>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(dados);
    return this.http.post<enterprise>(`${this.API}`,formData,{headers});
  }
  getAll():Observable<enterprise[]>{
    return this.http.get<enterprise[]>(`${this.API}`);
  }
  get(id:number):Observable<enterprise>{
    const headers = this.token.getAuthHeaders();
    return this.http.get<enterprise>(`${this.API}${id}`,{headers});
  }
  update(id:number,dados:enterprise):Observable<enterprise>{
    const headers = this.token.getAuthHeaders();
    const formData = toFormData(dados);
    return this.http.patch<enterprise>(`${this.API}${id}/`,formData,{headers});
  }
  delete(id:number){
    //backend não tá deixando mexer
    const headers = this.token.getAuthHeaders();
    return this.http.delete(`${this.API}${id}/`,{headers});
  }
}
