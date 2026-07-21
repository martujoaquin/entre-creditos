import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { Review } from '../../models/review.model';

export type ReviewCardVariant = 'general' | 'movie-detail';

@Component({
  selector: 'app-review-card',
  standalone: true,
  templateUrl: './review-card.html',
  styleUrl: './review-card.css',
})
export class ReviewCard implements AfterViewInit {
  @ViewChild('excerptElement') private readonly excerptElement?: ElementRef<HTMLElement>;

  @Input({ required: true }) review!: Review;
  @Input() variant: ReviewCardVariant = 'general';
  @Input() isOwnReview = false;

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() share = new EventEmitter<number>();

  isExpanded = false;
  canExpand = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.measureExcerptOverflow();
  }

  get authorInitial(): string {
    return this.review.author.name.trim().charAt(0).toUpperCase();
  }

  get isMovieDetail(): boolean {
    return this.variant === 'movie-detail';
  }

  get showActions(): boolean {
    return this.isMovieDetail;
  }

  get excerptId(): string {
    return `review-excerpt-${this.variant}-${this.review.id}`;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isExpanded) {
      this.measureExcerptOverflow();
    }
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  onEdit(): void {
    this.edit.emit(this.review.id);
  }

  onDelete(): void {
    this.delete.emit(this.review.id);
  }

  onShare(): void {
    this.share.emit(this.review.id);
  }

  private measureExcerptOverflow(): void {
    if (!this.isMovieDetail || !this.excerptElement) {
      return;
    }

    requestAnimationFrame(() => {
      const element = this.excerptElement?.nativeElement;

      if (!element || this.isExpanded) {
        return;
      }

      const isOverflowing = element.scrollHeight > element.clientHeight + 1;

      if (this.canExpand !== isOverflowing) {
        this.canExpand = isOverflowing;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
