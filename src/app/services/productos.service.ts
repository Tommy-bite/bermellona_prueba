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

  obtenerProducto(id : any) : Observable<Producto>{
    return this.http.get<Producto>(environment.apiURL + 'api_ecommerce/' + 'productos/' + id );
  }


  obtenerTodosLosProductos() : Observable<Producto[]>{
    return this.http.get<Producto[]>(environment.apiURL + 'api_ecommerce/' + 'productos');
  }

  obtenerTodosLasCategorias() {
    return this.http.get(environment.apiURL + 'api_ecommerce/' + 'categorias');
  }

  guardarProducto(data: any, edit ?: any){
    if(edit == 'editar'){
      const id = data.get('id'); // Obtener el 'id' del FormData
      return this.http.patch(`${environment.apiURL}api_ecommerce/productos/${id}/`, data);
    }
    return this.http.post(environment.apiURL + 'api_ecommerce/' + 'productos/', data);
  }
}
