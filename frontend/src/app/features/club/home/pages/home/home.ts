import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  isCheckingSession = true;
  sessionMessage = '';

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: () => {
        this.isCheckingSession = false;
        this.sessionMessage = '';
      },
      error: (message: string) => {
        this.isCheckingSession = false;
        this.sessionMessage = message;
      },
    });
  }
}
