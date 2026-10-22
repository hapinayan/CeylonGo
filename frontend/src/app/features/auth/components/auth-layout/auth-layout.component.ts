import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  @Input({ required: true }) backgroundImage!: string;
  @Input() taglineMain: string = '';
  @Input() taglineHighlight: string = '';
  @Input() taglineSub: string = '';
  @Input({ required: true }) cardTitle!: string;
  @Input({ required: true }) cardSubtitle!: string;
}
