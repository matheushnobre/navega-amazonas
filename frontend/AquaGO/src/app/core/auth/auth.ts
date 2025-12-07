import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token-service';
import { TokenUsuario } from '../../shared/models/token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  apiUrl:string = environment.apiUrl;

  constructor(private http:HttpClient,private tokenService: TokenService){}

  login(username:string,password:string):Observable<TokenUsuario>{
    return this.http.post<TokenUsuario>(`${this.apiUrl}/api/token/`, { username, password });
  }
  refresh(token:string):Observable<TokenUsuario>{
    return this.http.post<TokenUsuario>(`${this.apiUrl}/api/token/refresh/`, { token });
  }

  salvarToken(token: string) {
    this.tokenService.setToken(token);
  }

  logout() {
    this.tokenService.logout();
  }
}