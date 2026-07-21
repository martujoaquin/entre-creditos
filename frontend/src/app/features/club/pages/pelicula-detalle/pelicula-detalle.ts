import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, map, switchMap, take } from 'rxjs';

import { Movie } from '../../../../core/models/movie.models';
import { MovieService } from '../../../../core/services/movie.service';

@Component({
  selector: 'app-pelicula-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pelicula-detalle.html',
  styleUrl: './pelicula-detalle.css',
})
export class PeliculaDetalle {
  movie: Movie | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly movieService: MovieService,
  ) {
    this.loadMovie();
  }

  private loadMovie(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        switchMap((id) => this.movieService.getMovieById(id)),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: (movie) => {
          this.movie = movie;
        },
        error: (message: string) => {
          console.error('Error al cargar el detalle de película', message);
          this.movie = null;
          this.errorMessage = message || 'No pudimos cargar la película. Intentá nuevamente.';
        },
      });
  }
}
