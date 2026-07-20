import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  isLoggingOut = false;
  logoutErrorMessage = '';

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.logoutErrorMessage = '';
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.router.navigate(['/login']);
      },
      error: (message: string) => {
        this.isLoggingOut = false;
        this.logoutErrorMessage = message;
      },
    });
  }
}
