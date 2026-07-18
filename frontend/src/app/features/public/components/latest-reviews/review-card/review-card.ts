import { Component, Input } from '@angular/core';
import { ReviewCardData } from '../review-card-data';

@Component({
  selector: 'app-review-card',
  standalone: true,
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard {
  @Input({ required: true }) review!: ReviewCardData;

  get authorInitial(): string {
    return this.review.author.name.trim().charAt(0).toUpperCase();
  }
}
