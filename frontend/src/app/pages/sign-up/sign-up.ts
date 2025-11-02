import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../shared/validators/password-validators';
import { AuthService } from '../../core/services/auth-service';
import { Footer } from "../../shared/components/footer/footer";
import { NavBar } from "../../shared/components/nav-bar/nav-bar";

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Footer, NavBar],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
 signupForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null; 

  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  ngOnInit(): void {
    this.signupForm = this._fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator 
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.errorMessage = null; 

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched(); 
      return;
    }

    this.isLoading = true;

    const userData = {
      nombre: this.signupForm.value.nombre,
      correo_electronico: this.signupForm.value.email,
      contrasena: this.signupForm.value.password
    };

    this._authService.signupUser(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this._router.navigate(['/inicio-sesion']); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error durante el registro:', err);
        this.isLoading = false;
        

        const backendError = err.error?.message || 'Error de conexión o email ya registrado.';
        this.errorMessage = backendError;

        this.signupForm.get('password')?.reset();
        this.signupForm.get('confirmPassword')?.reset();
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
