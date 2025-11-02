import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObrasServices {
  private apiUrl = `${environment.API_BASE_URL}/obras`;
  constructor(private http: HttpClient){}

  getTop3Artworks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-3`); 
  }

  getAllArtworks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
