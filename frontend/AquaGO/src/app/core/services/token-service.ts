import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): string | null{
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders{
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  setToken(token:string){
    localStorage.setItem('token',token);
  }
  logout():void{
    localStorage.removeItem('token');
  }
  isTokenValid(): boolean{
    const token = this.getToken();
    if (!token) return false;
    const parts = token.split('.');
    if(parts.length !== 3 ) return false; // Não é JWT

    try{
      const payload = JSON.parse(atob(parts[1]));

      const exp = payload.exp;
      if (!exp) return false;

      return Date.now() < exp * 1000;
    } catch{
      return false;
    }
  }
}
