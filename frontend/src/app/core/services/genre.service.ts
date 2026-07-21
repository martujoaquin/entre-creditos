import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Genre, GenresResponse } from '../models/genre.models';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<GenresResponse>(`${this.apiUrl}?resource=generos`, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success || !response.generos) {
            throw new Error(response.message || 'No pudimos cargar los géneros.');
          }

          return response.generos;
        }),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  private toUserMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return 'No pudimos cargar los géneros.';
    }

    if (error instanceof Error && error.message.trim() !== '') {
      return error.message;
    }

    return 'No pudimos cargar los géneros.';
  }
}
