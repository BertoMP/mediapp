import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { GlucometriaListModel } from '../interfaces/glucometria-list.model';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGlucometria(page:number) {
    return this.http.get<GlucometriaListModel>(`${this.apiUrl}/glucometria?page=${page}`);
  }
  getSpecificPageGlucometria(page:string) {
    return this.http.get<GlucometriaListModel>(`${this.apiUrl}${page}`);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string[] = errorRes.error.errors ?? ['Ha ocurrido un error durante el proceso'];

    return throwError(() => errorMessage);
  }
}
