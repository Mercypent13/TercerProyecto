import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Footer } from "../../shared/components/footer/footer";
import { NavBar } from "../../shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Footer, NavBar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null; 

  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      correo_electronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

onSubmit(): void {
    this.errorMessage = null; 

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;

    const credentials = {
      correo_electronico: this.loginForm.value.correo_electronico,
      contrasena: this.loginForm.value.contrasena
    };

    this._authService.loginUser(credentials).subscribe({
      next: (response: AuthResponse) => {
        console.log('Inicio de sesión exitoso:', response);

        if (response.data) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            console.log('Datos de usuario guardados en localStorage.');
        }

        if (response.token) {
            localStorage.setItem('authToken', response.token);
            console.log('Token de autenticación guardado en localStorage.');
        }
        
        this._router.navigate(['/dashboard']); 
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error durante el inicio de sesión:', err);
        this.isLoading = false;

        let errorMsg = 'Error al intentar conectar. ¿El servidor está corriendo?';
        
        if (err.status === 404) {
            errorMsg = 'Error 404: La ruta del servidor /api/auth/login no fue encontrada. Revisa tu configuración de Express/Node.';
        } else if (err.error?.message) {
            errorMsg = err.error.message;
        } else if (err.statusText) {
            errorMsg = `Error ${err.status}: ${err.statusText}.`;
        }
        
        this.errorMessage = errorMsg;
        this.loginForm.get('contrasena')?.reset();
        
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
