import { Component } from '@angular/core';
import {  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {  MatDialogModule} from '@angular/material/dialog';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductosComponent } from '../productos/productos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatDialogModule, FormsModule, ReactiveFormsModule, HeaderComponent, ProductosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {



}
