import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../interface/usuario';
import {MatTooltipModule} from '@angular/material/tooltip';
import Notificacion from 'notiflix';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  usuarioLogueado : any;

  constructor(private dialog: MatDialog, private LoginService : LoginService) {

    this.LoginService.usuarioLogueado$.subscribe((usuarioLogueado : any) => {
      this.usuarioLogueado = usuarioLogueado;
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '720px', 
    });
  }

  openRegistroDialog() {
    this.dialog.open(RegistroComponent, {
      width: '720px',
    });
  }

  cerrarSesion(){
    Notificacion.Confirm.show(
      "Cerrar sesión",
      "¿Deseas cerrar la sesión actual?",
      "Si 😢",
      "No 😊",
      () => {
        Notificacion.Notify.success('¡Se ha cerrado la sesión correctamente!')
        this.LoginService.cerrarSesion();
      },
      () => {
        console.log('accion cancelada por el usuario');
      },
    )
  }

}



@Component({
  selector: 'app-dialog-login',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule,MatBadgeModule],
  templateUrl: './dialog-login.component.html',
})
export class LoginDialogComponent {

  formLogin: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private loginService : LoginService,
    private dialogRef: MatDialogRef<LoginDialogComponent> // Para cerrar el modal
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    Notificacion.Notify.init({
      position: 'center-top'
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  iniciarSesion() {
    if (this.formLogin.valid) {
      Notificacion.Loading.standard('Cargando perfil...')
     this.loginService.login(this.formLogin.value).subscribe({
      next : (resp : Usuario) => {
        Notificacion.Loading.remove();
        localStorage.setItem('token', resp.token);
        localStorage.setItem('email', resp.user.email);
        localStorage.setItem('nombre', resp.user.first_name);
        localStorage.setItem('apellido', resp.user.last_name);
        localStorage.setItem('usuairo', resp.user.username);
        this.dialogRef.close();
        Notificacion.Notify.success('Se ha iniciado sesión correctamente! ❤️');
      },error : ( error : any ) => {
        this.formLogin.markAllAsTouched();
        Notificacion.Loading.remove();
        Notificacion.Notify.failure('Ha ocurrido un error inesperado al iniciar sesión, intentelo más tarde! 😢')
      }
     })
    } else {
      this.formLogin.markAllAsTouched();
    }
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

}



@Component({
  selector: 'app-dialog-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, CommonModule],
  templateUrl: './dialog-registro.component.html',
})
export class RegistroComponent {

  formRegister: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService : LoginService,
    private dialogRef: MatDialogRef<RegistroComponent> // Para cerrar el modal
  ) {
    this.formRegister = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  register() {
    if (this.formRegister.valid) {
      console.log('Formulario válido:', this.formRegister.value);
      this.dialogRef.close(); 
    } else {
      this.formRegister.markAllAsTouched();
    }
  }

  closeDialog() {
    this.dialogRef.close(); // Método para cerrar el modal
  }

}


