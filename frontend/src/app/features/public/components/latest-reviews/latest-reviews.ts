import { Component } from '@angular/core';
import { ReviewCard } from './review-card/review-card';
import { ReviewCardData } from './review-card-data';

@Component({
  selector: 'app-latest-reviews',
  standalone: true,
  imports: [ReviewCard],
  templateUrl: './latest-reviews.html',
  styleUrl: './latest-reviews.css',
})
export class LatestReviews {
  protected readonly reviews: ReviewCardData[] = [
    {
      id: 1,
      movie: {
        id: 101,
        title: 'Aftersun',
        director: 'Charlotte Wells',
        year: 2022,
        imageUrl: '/images/hero-cinema.jpg',
        imageAlt: 'Paisaje cinematográfico usado como imagen temporal para Aftersun',
      },
      rating: 9,
      highlightedQuote: 'Una memoria luminosa que parece hablar bajito, incluso cuando duele.',
      excerpt:
        'Entre recuerdos imperfectos y silencios compartidos, la película transforma unas vacaciones comunes en algo imposible de olvidar.',
      author: {
        id: 201,
        name: 'Clara Ibarra',
        avatarUrl: null,
      },
    },
    {
      id: 2,
      movie: {
        id: 102,
        title: 'Perfect Days',
        director: 'Wim Wenders',
        year: 2023,
        imageUrl: '/images/hero-cinema.jpg',
        imageAlt: 'Paisaje cinematográfico usado como imagen temporal para Perfect Days',
      },
      rating: 10,
      highlightedQuote: 'La rutina como una forma de atención: mirar mejor, respirar más lento.',
      excerpt:
        'Cada pequeño gesto construye una vida completa. No sucede demasiado y, sin embargo, todo parece tener sentido.',
      author: {
        id: 202,
        name: 'Mateo Ruiz',
        avatarUrl: '',
      },
    },
    {
      id: 3,
      movie: {
        id: 103,
        title: 'La ciénaga',
        director: 'Lucrecia Martel',
        year: 2001,
        imageUrl: '/images/hero-cinema.jpg',
        imageAlt: 'Paisaje cinematográfico usado como imagen temporal para La ciénaga',
      },
      rating: 9,
      highlightedQuote: 'Un verano detenido, pesado y brillante, donde todo parece estar por quebrarse.',
      excerpt:
        'El calor, los cuerpos y los sonidos convierten lo cotidiano en una tensión constante que nunca termina de explotar.',
      author: {
        id: 203,
        name: 'Julia Montes',
        avatarUrl: null,
      },
    },
  ];
}
