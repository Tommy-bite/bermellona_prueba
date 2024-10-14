import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../interface/usuario';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  private usuarioLogueado = new BehaviorSubject<boolean>(false);
  public usuarioLogueado$ = this.usuarioLogueado.asObservable();

  constructor(private http : HttpClient) { 
    const token = localStorage.getItem('token')
    if (token) {
      this.usuarioLogueado.next(true);
    }
  }

  login(data : Usuario) : Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiURL + 'api_usuarios/' + 'login', JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe( tap( () => { 
      localStorage.setItem('isAuth' , 'true'),
      this.usuarioLogueado.next(true);
    }))
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.usuarioLogueado.next(false);  
  }

  estaLogueado(): boolean {
    return this.usuarioLogueado.getValue();
  }
}
