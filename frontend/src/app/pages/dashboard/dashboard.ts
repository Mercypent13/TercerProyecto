import { Component, computed, inject, signal } from '@angular/core';
import { Obra } from '../../shared/interfaces/data-interfaces';
import { ObrasServices } from '../../core/services/obras-services';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public currentUser = signal<UserData | null>(null);

  public _obrasService = inject(ObrasServices)
  public _authServices = inject(AuthService)
  
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  private _allUsers = signal<UserData[]>([
    { _id: 'u1', nombre: 'Admin Master', correo_electronico: 'admin@pixel.com', rol: 'admin' },
    { _id: 'u2', nombre: 'Carlos Usuario', correo_electronico: 'carlos@user.com', rol: 'usuario' },
    { _id: 'u3', nombre: 'María Artista', correo_electronico: 'maria@art.com', rol: 'usuario' },
  ]);
  public allUsers = this._allUsers.asReadonly();

  private _router = inject(Router)

  private _allObras = signal<Obra[]>([]);
  public allObras = this._allObras.asReadonly();
  
  public userObras = computed(() => {
    const user = this.currentUser();
    if (!user || user.rol === 'admin') return [];
    
    return this._allObras().filter(obra => obra.autor.nombre === user.nombre);
  });
  

  constructor() {}

  ngOnInit(): void {
     this.loadCurrentUserFromLocalStorage();
    if (this.currentUser()) {
        this.loadAllArtworks();
    } else {
        this.isLoading.set(false);
    }
    
  }

  private loadCurrentUserFromLocalStorage(): void {
    const userDataJson = localStorage.getItem('currentUser');
    if (userDataJson) {
        try {
            const userData: UserData = JSON.parse(userDataJson);
            this.currentUser.set(userData);
            console.log('Usuario cargado desde localStorage:', userData.nombre);
        } catch (e) {
            console.error('Error parsing user data from localStorage', e);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
        }
    } else {
        console.log('No se encontró usuario en localStorage.');
        this._router.navigate(['/inicio-sesion']); 
    }
  }

  private loadAllArtworks(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this._obrasService.getAllArtworks()
      .pipe(
        tap((obras: any) => {
          this._allObras.set(obras.data);
          console.log(obras)
        }),
        catchError((err) => {
          this.error.set('No se pudieron cargar las obras. Inténtalo de nuevo.');
          console.error('Error al cargar obras:', err);
          return of([]); // Retorna un Observable vacío en caso de error
        })
      )
      .subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });
  }


  logout(): void {
    this._authServices.logout()
    this._router.navigate(['/inicio-sesion']); 
  }
}
