export interface ReviewCardData {
  id: number;
  movie: {
    id: number;
    title: string;
    director: string;
    year: number;
    imageUrl: string;
    imageAlt: string;
  };
  rating: number;
  highlightedQuote: string;
  excerpt: string;
  author: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
}
