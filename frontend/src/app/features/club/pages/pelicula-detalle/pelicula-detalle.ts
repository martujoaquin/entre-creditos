import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, map, switchMap, take } from 'rxjs';

import { Movie } from '../../../../core/models/movie.models';
import { MovieService } from '../../../../core/services/movie.service';
import { ReviewCard } from '../../../reviews/components/review-card/review-card';
import { Review } from '../../../reviews/models/review.model';

@Component({
  selector: 'app-pelicula-detalle',
  standalone: true,
  imports: [RouterLink, ReviewCard],
  templateUrl: './pelicula-detalle.html',
  styleUrl: './pelicula-detalle.css',
})
export class PeliculaDetalle {
  movie: Movie | null = null;
  isLoading = true;
  errorMessage = '';
  protected readonly currentUserId = 1;
  protected readonly reviews: Review[] = [
    {
      id: 1,
      rating: 9,
      highlightedQuote: 'Una película que convierte la distancia en una forma de memoria.',
      excerpt:
        'La emoción aparece en detalles mínimos: una mirada, una pausa y esa sensación de que el tiempo también puede abrazar Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ullamcorper malesuada pharetra. Cras ante ex, efficitur sit amet interdum sit amet, condimentum vel felis. Donec rhoncus vestibulum orci quis molestie. Donec pharetra nulla vitae velit auctor dignissim. Integer a velit erat. Vivamus accumsan a sapien non laoreet. Suspendisse viverra sapien mi. Proin mauris dolor, condimentum non gravida eu, aliquam id lorem. Nulla vel ex sed leo cursus bibendum id eget leo. Phasellus luctus facilisis gravida. Morbi ac feugiat tortor. Maecenas placerat massa sit amet mattis fringilla. Morbi consectetur, sapien sit amet dignissim pharetra, dolor mauris viverra mauris, eget pharetra tortor enim nec ipsum. Suspendisse potenti.',
      createdAt: '20/07/2026',
      author: {
        id: 1,
        name: 'Martina López',
      },
    },
    {
      id: 2,
      rating: 8,
      highlightedQuote: 'Íntima, precisa y luminosa incluso cuando se acerca al dolor.',
      excerpt:
        'La puesta en escena deja respirar a los personajes y encuentra belleza en lo que queda sin decir. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ullamcorper malesuada pharetra. Cras ante ex, efficitur sit amet interdum sit amet, condimentum vel felis. Donec rhoncus vestibulum orci quis molestie. Donec pharetra nulla vitae velit auctor dignissim. Integer a velit erat. Vivamus accumsan a sapien non laoreet. Suspendisse viverra sapien mi. Proin mauris dolor, condimentum non gravida eu, aliquam id lorem. Nulla vel ex sed leo cursus bibendum id eget leo. Phasellus luctus facilisis gravida. Morbi ac feugiat tortor. Maecenas placerat massa sit amet mattis fringilla. Morbi consectetur, sapien sit amet dignissim pharetra, dolor mauris viverra mauris, eget pharetra tortor enim nec ipsum. Suspendisse potenti.',
      createdAt: '21/07/2026',
      author: {
        id: 2,
        name: 'Nicolás Vera',
      },
    },
    {
      id: 3,
      rating: 9,
      highlightedQuote: 'Una obra sensible sobre lo que recordamos y lo que apenas intuimos.',
      excerpt:
        'La película encuentra una potencia enorme en gestos chicos y vuelve inolvidable una historia aparentemente simple.',
      createdAt: '21/07/2026',
      author: {
        id: 3,
        name: 'Clara Ibarra',
      },
    },
    {
      id: 4,
      rating: 9,
      highlightedQuote: 'Una obra sensible sobre lo que recordamos y lo que apenas intuimos.',
      excerpt:
        'La película encuentra una potencia enorme en gestos chicos y vuelve inolvidable una historia aparentemente simple.',
      createdAt: '21/07/2026',
      author: {
        id: 3,
        name: 'Clara Ibarra',
      },
    },
    {
      id: 5,
      rating: 8,
      highlightedQuote: 'Íntima, precisa y luminosa incluso cuando se acerca al dolor.',
      excerpt:
        'La puesta en escena deja respirar a los personajes y encuentra belleza en lo que queda sin decir. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ullamcorper malesuada pharetra. Cras ante ex, efficitur sit amet interdum sit amet, condimentum vel felis. Donec rhoncus vestibulum orci quis molestie. Donec pharetra nulla vitae velit auctor dignissim. Integer a velit erat. Vivamus accumsan a sapien non laoreet. Suspendisse viverra sapien mi. Proin mauris dolor, condimentum non gravida eu, aliquam id lorem. Nulla vel ex sed leo cursus bibendum id eget leo. Phasellus luctus facilisis gravida. Morbi ac feugiat tortor. Maecenas placerat massa sit amet mattis fringilla. Morbi consectetur, sapien sit amet dignissim pharetra, dolor mauris viverra mauris, eget pharetra tortor enim nec ipsum. Suspendisse potenti.',
      createdAt: '21/07/2026',
      author: {
        id: 2,
        name: 'Nicolás Vera',
      },
    }
  ];

  protected get ownReview(): Review | undefined {
    return this.reviews.find((review) => review.author.id === this.currentUserId);
  }

  protected get otherReviews(): Review[] {
    return this.reviews.filter((review) => review.author.id !== this.currentUserId);
  }

  protected get leftColumnReviews(): Review[] {
    return this.otherReviews.filter((_, index) => index % 2 === 0);
  }

  protected get rightColumnReviews(): Review[] {
    return this.otherReviews.filter((_, index) => index % 2 !== 0);
  }

  protected get hasOwnReview(): boolean {
    return this.ownReview !== undefined;
  }

  protected onEditReview(reviewId: number): void {
    console.log('Editar reseña', reviewId);
  }

  protected onDeleteReview(reviewId: number): void {
    console.log('Eliminar reseña', reviewId);
  }

  protected onShareReview(reviewId: number): void {
    console.log('Compartir reseña', reviewId);
  }

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
