import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(passwordInput: HTMLInputElement): void {
    this.showPassword = !this.showPassword;
    passwordInput.focus();
  }

  toggleConfirmPasswordVisibility(confirmPasswordInput: HTMLInputElement): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    confirmPasswordInput.focus();
  }
}
