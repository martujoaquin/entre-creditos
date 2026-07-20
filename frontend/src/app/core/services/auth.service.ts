import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  SessionUser,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly currentUserSignal = signal<SessionUser | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<SessionUser> {
    const body = new FormData();
    body.append('action', 'login');
    body.append('email', email);
    body.append('password', password);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}?action=login`, body, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success || !response.usuario) {
            throw new Error(response.message || 'No pudimos iniciar sesión.');
          }

          return response.usuario;
        }),
        tap((usuario) => this.setCurrentUser(usuario)),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    const body = new FormData();
    body.append('action', 'register');
    body.append('nombre_completo', request.nombre_completo);
    body.append('email', request.email);
    body.append('password', request.password);
    body.append('confirm_password', request.confirm_password);

    return this.http
      .post<RegisterResponse>(`${this.apiUrl}?action=register`, body, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'No pudimos crear la cuenta.');
          }

          return response;
        }),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  me(): Observable<SessionUser> {
    return this.http
      .get<MeResponse>(`${this.apiUrl}?action=me`, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success || !response.usuario) {
            throw new Error(response.message || 'No hay una sesión activa.');
          }

          return response.usuario;
        }),
        tap((usuario) => this.setCurrentUser(usuario)),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  logout(): Observable<LogoutResponse> {
    const body = new FormData();
    body.append('action', 'logout');

    return this.http
      .post<LogoutResponse>(`${this.apiUrl}?action=logout`, body, { withCredentials: true })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'No pudimos cerrar la sesión.');
          }

          return response;
        }),
        tap(() => this.setCurrentUser(null)),
        catchError((error: unknown) => throwError(() => this.toUserMessage(error))),
      );
  }

  setCurrentUser(usuario: SessionUser | null): void {
    this.currentUserSignal.set(usuario);
  }

  private toUserMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return 'No pudimos conectar con el servidor. Intentá nuevamente en unos minutos.';
    }

    if (error instanceof Error && error.message.trim() !== '') {
      return error.message;
    }

    return 'Ocurrió un error inesperado. Intentá nuevamente.';
  }
}
