import { Component } from '@angular/core';
import { finalize } from 'rxjs';

import { Movie } from '../../../../core/models/movie.models';
import { MovieService } from '../../../../core/services/movie.service';
import { MovieCard } from '../../components/movie-card/movie-card';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [MovieCard],
  templateUrl: './peliculas.html',
  styleUrl: './peliculas.css',
})
export class Peliculas {
  movies: Movie[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly movieService: MovieService) {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService
      .getMovies()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (movies) => {
          this.movies = movies;
        },
        error: (message: string) => {
          console.error('Error al cargar películas', message);
          this.movies = [];
          this.errorMessage = message || 'No pudimos cargar las películas. Intentá nuevamente.';
        },
      });
  }
}
