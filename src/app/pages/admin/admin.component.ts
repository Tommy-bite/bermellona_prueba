import { ChangeDetectorRef, Component, Inject, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interface/producto';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { MonedaChilenaPipe } from '../../pipes/moneda-chilena.pipe';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Notiflix from 'notiflix';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HeaderComponent, MatTabsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, NgIf, NgClass, MonedaChilenaPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  // displayedColumns: string[] = ['id', 'codigo', 'nombre', 'descripcion', 'imagen', 'precio', 'precio_descuento', 'cantidad', 'categoria'];
  displayedColumns: string[] = ['codigo', 'nombre', 'imagen', 'precio', 'cantidad', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  public productos !: Producto[];
  readonly dialog = inject(MatDialog);
  productoEdit : any;


  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private productosService: ProductosService, private cdr: ChangeDetectorRef) {
    this.productosService.obtenerTodosLosProductos().subscribe({
      next: (resp: Producto[]) => {
        this.dataSource.data = resp;
        this.productos = resp;
        this.dataSource.paginator = this.paginator; // Vincula el paginador
        this.dataSource.sort = this.sort; // Vincula el sort
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  // Método para aplicar filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplica el filtro en minúsculas y sin espacios en blanco
  }

  agregarProducto(tipo ?: any, id ?: any) {
    if (tipo == 'editar') {
      this.productosService.obtenerProducto(id).subscribe({
          next: (resp: Producto) => {
              this.productoEdit = resp;

              // Abrimos el diálogo después de obtener la zona
              const dialogRef = this.dialog.open(DialogIngresoProducto, {
                  height: '680px',
                  width: '600px',
                  data: this.productoEdit // Pasar los datos de la zona si es edición
              });

              dialogRef.componentInstance.guardadoProducto.subscribe(() => {
                  console.log('Evento onZonaSaved emitido, actualizando tabla...');
                  this.actualizarTabla();
              });
          },
          error: (error: any) => {
              console.error(error);
          }
      });
  } else {
      const dialogRef = this.dialog.open(DialogIngresoProducto, {
        height: '680px',
        width: '600px'
      });
  
      dialogRef.componentInstance.guardadoProducto.subscribe(() => {
        console.log('Evento onZonaSaved emitido, actualizando tabla...');
        this.actualizarTabla();
      });
  }


  
  }

  actualizarTabla() {
    this.productosService.obtenerTodosLosProductos().subscribe({
      next: (resp: Producto[]) => {
        this.dataSource.data = resp;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


}


@Component({
  selector: 'app-dialog-ingreso-producto',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, FormsModule, NgIf, CommonModule, MatFormFieldModule],
  templateUrl: './dialog-ingreso-producto.html',
})
export class DialogIngresoProducto {

  formIngreso: FormGroup;
  public guardadoProducto: Subject<void> = new Subject<void>();
  public isEditMode: boolean = false;


  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private dialogRef: MatDialogRef<DialogIngresoProducto>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.formIngreso = this.fb.group({
      id: '',
      codigo: [this.generateCodigo(), Validators.required],  // Genera el código al inicializar el formulario
      nombre: ['', Validators.required],
      imagen: '',
      precio: ['', Validators.required],
      cantidad: '',
      descripcion: [''],
      categoria: 1
    });

    if (data) {
      this.isEditMode = true;
      this.cargarDatosProducto(data); // Cargar datos de la zona en el formulario
    }
  }

  cargarDatosProducto(producto: Producto) {
    this.formIngreso.patchValue({
        id : producto.id,
        codigo : producto.codigo,
        nombre: producto.nombre,
        imagen : '',
        precio: producto.precio,
        cantidad : producto.cantidad,
        descripcion : producto.descripcion,
        categoria : producto.categoria
    });
}

  // Función para generar un código de 6 dígitos
  generateCodigo(): number {
    return Math.floor(100000 + Math.random() * 900000);  // Genera un número aleatorio entre 100000 y 999999
  }

  guardarProducto() {

    if(this.formIngreso.valid){

      const formData = new FormData();

      // Añadir los valores del formulario a FormData
      formData.append('codigo', this.formIngreso.get('codigo')?.value);
      formData.append('nombre', this.formIngreso.get('nombre')?.value);
      formData.append('precio', this.formIngreso.get('precio')?.value);
      formData.append('descripcion', this.formIngreso.get('descripcion')?.value);
      formData.append('cantidad', '1'); // Valor por defecto para cantidad
      formData.append('categoria', '1'); // Valor por defecto para cantidad
  
      // Verificar si hay un archivo seleccionado en el input de tipo file
      const imagenInput = (document.getElementById('fileInput') as HTMLInputElement);
      if (imagenInput && imagenInput.files && imagenInput.files.length > 0 ) {
        formData.append('imagen', imagenInput.files[0]);  // Añadir la imagen seleccionada a FormData
      } else {
        console.error('No se ha seleccionado una imagen');
      }

      if(this.data){

        const id = this.formIngreso.get('id')?.value;
        formData.append('id', id ? id.toString() : '');  // Convierte el ID a cadena
        console.log('ID del producto:', id);
        console.log('ID en formData:', formData.get('id'));

        this.productosService.guardarProducto(formData, 'editar').subscribe({
          next: (resp: any) => {
            console.log('Producto guardado:', resp);
            Notiflix.Notify.success("Se ha guardado los cambios del producto correctamente");
            this.dialogRef.close();
            this.guardadoProducto.next()
          },
          error: (error: any) => {
            console.error('Error al guardar el producto:', error);
          }
        });

      }else{
    
        // Llamar al servicio para guardar el producto
        this.productosService.guardarProducto(formData).subscribe({
          next: (resp: any) => {
            console.log('Producto guardado:', resp);
            Notiflix.Notify.success("Se ha creado el producto  correctamente");
            this.dialogRef.close();
            this.guardadoProducto.next()
          },
          error: (error: any) => {
            console.error('Error al guardar el producto:', error);
          }
        });
      }
      }
  }

}

