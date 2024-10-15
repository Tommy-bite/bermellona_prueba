import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../interface/usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  private usuarioLogueado = new BehaviorSubject<boolean>(false);
  public usuarioLogueado$ = this.usuarioLogueado.asObservable();
    
  private usuarioAdmin = new BehaviorSubject<boolean>(false);
  public usuarioAdmin$ = this.usuarioAdmin.asObservable();

  constructor(private http : HttpClient) { 
    const token = localStorage.getItem('token')
    const admin = localStorage.getItem('admin')
    if (token) {
      this.usuarioLogueado.next(true);
    }

    if(token && admin){
      this.usuarioAdmin.next(true);
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

  registrar(data : any){
    return this.http.post<Usuario>(environment.apiURL + 'api_usuarios/' + 'register', JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.usuarioLogueado.next(false);  
    this.usuarioAdmin.next(false); 
  }

  estaLogueado(): boolean {
    return this.usuarioLogueado.getValue();
  }
}
