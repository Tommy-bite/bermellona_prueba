import { Component } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interface/producto';
import { CommonModule } from '@angular/common';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, MonedaChilenaPipe],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent  {

  public productos !: Producto[];
  public categorias!: any[];

  constructor(private productosService : ProductosService){
    this.productosService.obtenerTodosLosProductos().subscribe({
      next : (resp : Producto[]) => {
        this.productos = resp;
        console.log(resp);
      }
    })

    this.productosService.obtenerTodosLasCategorias().subscribe({
      next : (resp : any) => {
        this.categorias = resp;
      }
    })

  }


  obtenerNombreCategoria(id: number): string | undefined {
    if (!this.categorias || this.categorias.length === 0) {
      return undefined;
    }
    
    const categoria = this.categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : undefined;
  }
  
}
