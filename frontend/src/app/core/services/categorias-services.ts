import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  constructor(private http: HttpClient){}
  private apiUrl = `${environment.API_BASE_URL}/categorias`;

  getAllcategorias(): Observable<any>{
    return this.http.get(`${this.apiUrl}/`)
  }

}
