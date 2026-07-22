import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Genre } from '../../../../core/models/genre.models';
import { Movie } from '../../../../core/models/movie.models';
import { GenreService } from '../../../../core/services/genre.service';
import { MovieService } from '../../../../core/services/movie.service';

@Component({
  selector: 'app-peliculas',
  imports: [FormsModule],
  templateUrl: './peliculas.html',
  styleUrl: './peliculas.css',
})
export class Peliculas {
  movies: Movie[] = [];
  genres: Genre[] = [];
  selectedMovie: Movie | null = null;
  movieToToggle: Movie | null = null;
  posterLoadFailures = new Set<number>();
  form = this.createEmptyForm();
  selectedImage: File | null = null;
  imagePreviewUrl = '';
  isLoading = true;
  isSaving = false;
  isToggling = false;
  isFormModalOpen = false;
  isToggleModalOpen = false;
  loadError = '';
  genresError = '';
  formError = '';
  toggleError = '';
  feedbackMessage = '';

  constructor(
    private readonly movieService: MovieService,
    private readonly genreService: GenreService,
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  get isEditing(): boolean {
    return this.selectedMovie !== null;
  }

  get formTitle(): string {
    return this.isEditing ? 'Editar película' : 'Nueva película';
  }

  get formSubmitLabel(): string {
    if (this.isSaving) {
      return this.isEditing ? 'Guardando...' : 'Creando...';
    }

    return this.isEditing ? 'Guardar cambios' : 'Crear película';
  }

  get toggleTitle(): string {
    return this.movieToToggle && Number(this.movieToToggle.activo) === 1
      ? 'Inactivar película'
      : 'Reactivar película';
  }

  get toggleQuestion(): string {
    return this.movieToToggle && Number(this.movieToToggle.activo) === 1
      ? '¿Deseás inactivar esta película?'
      : '¿Deseás reactivar esta película?';
  }

  get toggleSubmitLabel(): string {
    if (this.isToggling) {
      return 'Guardando...';
    }

    return this.movieToToggle && Number(this.movieToToggle.activo) === 1 ? 'Inactivar' : 'Reactivar';
  }

  loadPageData(): void {
    this.loadMovies();
    this.loadGenres();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.loadError = '';

    this.movieService
      .getAdminMovies()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (movies) => {
          this.movies = movies;
        },
        error: (message: string) => {
          this.movies = [];
          this.loadError = message || 'No pudimos cargar las películas.';
        },
      });
  }

  loadGenres(): void {
    this.genresError = '';

    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (message: string) => {
        this.genres = [];
        this.genresError = message || 'No pudimos cargar los géneros.';
      },
    });
  }

  openCreateModal(): void {
    this.selectedMovie = null;
    this.form = this.createEmptyForm();
    this.selectedImage = null;
    this.imagePreviewUrl = '';
    this.formError = '';
    this.feedbackMessage = '';
    this.isFormModalOpen = true;
  }

  openEditModal(movie: Movie): void {
    this.selectedMovie = movie;
    this.form = {
      titulo: movie.titulo,
      director: movie.director,
      anio: String(movie.anio),
      id_genero: String(movie.id_genero),
      sinopsis: movie.sinopsis,
    };
    this.selectedImage = null;
    this.imagePreviewUrl = movie.imageUrl;
    this.formError = '';
    this.feedbackMessage = '';
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    if (this.isSaving) {
      return;
    }

    this.isFormModalOpen = false;
    this.selectedMovie = null;
    this.selectedImage = null;
    this.imagePreviewUrl = '';
    this.formError = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedImage = file;

    if (!file) {
      this.imagePreviewUrl = this.selectedMovie?.imageUrl ?? '';
      return;
    }

    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  saveMovie(): void {
    const validationError = this.validateForm();

    if (validationError) {
      this.formError = validationError;
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.form.titulo.trim());
    formData.append('director', this.form.director.trim());
    formData.append('anio', this.form.anio.trim());
    formData.append('id_genero', this.form.id_genero);
    formData.append('sinopsis', this.form.sinopsis.trim());

    if (!this.isEditing) {
      formData.append('activo', '1');
    }

    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
    }

    this.isSaving = true;
    this.formError = '';

    const request = this.selectedMovie
      ? this.movieService.updateMovie(this.selectedMovie.id_pelicula, formData)
      : this.movieService.createMovie(formData);

    request.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (response) => {
        this.feedbackMessage = response.message;
        this.closeFormModal();
        this.loadMovies();
      },
      error: (message: string) => {
        this.formError = message || 'No pudimos guardar la película.';
      },
    });
  }

  openToggleModal(movie: Movie): void {
    this.movieToToggle = movie;
    this.toggleError = '';
    this.feedbackMessage = '';
    this.isToggleModalOpen = true;
  }

  closeToggleModal(): void {
    if (this.isToggling) {
      return;
    }

    this.isToggleModalOpen = false;
    this.movieToToggle = null;
    this.toggleError = '';
  }

  toggleMovieStatus(): void {
    if (!this.movieToToggle) {
      return;
    }

    const nextStatus = Number(this.movieToToggle.activo) === 1 ? 0 : 1;
    this.isToggling = true;
    this.toggleError = '';

    this.movieService
      .toggleMovieStatus(this.movieToToggle.id_pelicula, nextStatus)
      .pipe(finalize(() => (this.isToggling = false)))
      .subscribe({
        next: (response) => {
          this.feedbackMessage = response.message;
          this.closeToggleModal();
          this.loadMovies();
        },
        error: (message: string) => {
          this.toggleError = message || 'No pudimos actualizar el estado.';
        },
      });
  }

  getGenreName(idGenero: number): string {
    return this.genres.find((genre) => Number(genre.id_genero) === Number(idGenero))?.nombre ?? 'Sin género';
  }

  getPosterUrl(movie: Movie): string {
    return this.posterLoadFailures.has(movie.id_pelicula) ? movie.defaultPosterUrl : movie.imageUrl;
  }

  onPosterError(movie: Movie): void {
    this.posterLoadFailures.add(movie.id_pelicula);
  }

  private validateForm(): string {
    const year = Number(this.form.anio);
    const currentYear = new Date().getFullYear();

    if (this.form.titulo.trim() === '') {
      return 'El título es obligatorio.';
    }

    if (this.form.director.trim() === '') {
      return 'El director es obligatorio.';
    }

    if (!Number.isInteger(year) || year < 1888 || year > currentYear) {
      return 'El año ingresado no es válido.';
    }

    if (this.form.id_genero === '') {
      return 'Seleccioná un género.';
    }

    if (this.form.sinopsis.trim() === '') {
      return 'La sinopsis es obligatoria.';
    }

    if (!this.isEditing && !this.selectedImage) {
      return 'La imagen es obligatoria.';
    }

    if (this.selectedImage && !['image/jpeg', 'image/png', 'image/webp'].includes(this.selectedImage.type)) {
      return 'El formato de imagen no es válido.';
    }

    return '';
  }

  private createEmptyForm() {
    return {
      titulo: '',
      director: '',
      anio: '',
      id_genero: '',
      sinopsis: '',
    };
  }

}
