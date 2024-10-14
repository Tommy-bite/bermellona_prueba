import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../interface/producto';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http : HttpClient) { }

  obtenerTodosLosProductos() : Observable<Producto[]>{
    return this.http.get<Producto[]>(environment.apiURL + 'api_ecommerce/' + 'productos');
  }

  obtenerTodosLasCategorias() {
    return this.http.get(environment.apiURL + 'api_ecommerce/' + 'categorias');
  }
}
