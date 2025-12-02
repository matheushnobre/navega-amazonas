import { Injectable } from '@angular/core';
import { toFormData } from '../utils/form-data';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token-service';
import { customUser } from '../../shared/models/customUser';
import { Observable } from 'rxjs';
import { Enterprise } from '../../features/enterprise/enterprise';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  caminho = environment.apiUrl;
  API = `${this.caminho}/api/users/`;

  constructor (private http:HttpClient,private tokenService:TokenService){}

  add(data: customUser): Observable<customUser> {
    const formData = toFormData(data);

    return this.http.post<customUser>(this.API, formData);
  }
  my_enterprises(): Observable<Enterprise[]>{
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<Enterprise[]>(`${this.API}enterprises/`,{headers});
  }
  get_security(): Observable<customUser>{
    const headers = this.tokenService.getAuthHeaders();
    return this.http.get<customUser>(`${this.API}me/`,{headers});
  }
}
