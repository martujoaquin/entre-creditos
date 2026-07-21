import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-club-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './club-navbar.html',
  styleUrl: './club-navbar.css',
})
export class ClubNavbar {
  avatarLoadFailed = false;
  isDrawerOpen = false;
  isAvatarMenuOpen = false;
  isLoggingOut = false;
  logoutError = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get currentUser() {
    return this.authService.currentUser();
  }

  get avatarUrl(): string | null {
    return this.avatarLoadFailed ? null : this.currentUser?.avatar ?? null;
  }

  get userInitial(): string {
    return this.currentUser?.nombre_completo.trim().charAt(0).toUpperCase() || 'U';
  }

  onAvatarError(): void {
    this.avatarLoadFailed = true;
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.logoutError = '';
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  toggleAvatarMenu(): void {
    this.isAvatarMenuOpen = !this.isAvatarMenuOpen;
    this.logoutError = '';
  }

  closeAvatarMenu(): void {
    this.isAvatarMenuOpen = false;
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.logoutError = '';

    this.authService
      .logout()
      .pipe(finalize(() => (this.isLoggingOut = false)))
      .subscribe({
        next: () => {
          this.closeDrawer();
          this.closeAvatarMenu();
          this.router.navigate(['/']);
        },
        error: () => {
          this.logoutError = 'No pudimos cerrar la sesión. Intentá nuevamente.';
        },
      });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDrawer();
    this.closeAvatarMenu();
  }
}
