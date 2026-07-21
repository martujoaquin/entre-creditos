export interface Review {
  id: number;
  rating: number;
  highlightedQuote: string;
  excerpt: string;
  createdAt?: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string | null;
  };
  movie?: {
    id: number;
    title: string;
    director: string;
    year: number;
    imageUrl: string;
    imageAlt: string;
  };
}
