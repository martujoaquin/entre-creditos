import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Movie, MovieApiItem, MoviesResponse } from '../models/movie.models';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly apiUrl = environment.apiUrl;
  private readonly backendBaseUrl = this.apiUrl.replace(/\/index\.php$/, '');
  private readonly defaultPosterPath = 'uploads/peliculas/default-poster.png';

  constructor(private readonly http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<MoviesResponse>(`${this.apiUrl}?resource=peliculas`, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success || !response.peliculas) {
            throw new Error(response.message || 'No pudimos cargar las películas.');
          }

          return response.peliculas
            .filter((movie) => Number(movie.activo) === 1)
            .map((movie) => this.toMovie(movie));
        }),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.getMovies().pipe(
      map((movies) => {
        const movie = movies.find((item) => Number(item.id_pelicula) === id);

        if (!movie) {
          throw new Error('La película no está disponible.');
        }

        return movie;
      }),
    );
  }

  private toMovie(movie: MovieApiItem): Movie {
    return {
      ...movie,
      imageUrl: this.toImageUrl(movie.imagen),
      defaultPosterUrl: this.toImageUrl(null),
    };
  }

  private toImageUrl(imagePath: string | null | undefined): string {
    const normalizedImagePath = imagePath?.trim() || this.defaultPosterPath;
    const invalidPaths = new Set(['null', 'undefined', 'uploads/peliculas/default.jpg']);
    const path = invalidPaths.has(normalizedImagePath.toLowerCase())
      ? this.defaultPosterPath
      : normalizedImagePath;

    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const normalizedPath = path.replace(/^\/+/, '');

    return `${this.backendBaseUrl}/${normalizedPath}`;
  }

  private toUserMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return 'No pudimos cargar las películas. Intentá nuevamente.';
    }

    if (error instanceof Error && error.message.trim() !== '') {
      return error.message;
    }

    return 'No pudimos cargar las películas. Intentá nuevamente.';
  }
}
