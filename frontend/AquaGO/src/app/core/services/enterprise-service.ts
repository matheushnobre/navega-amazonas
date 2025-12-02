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
}
