import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css'
})
export class LandingLayout {}
