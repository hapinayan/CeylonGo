import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './newsletter-section.component.html',
  styleUrl: './newsletter-section.component.scss',
})
export class NewsletterSectionComponent {
  protected readonly email = signal('');
  protected readonly status = signal<'idle' | 'success' | 'error'>('idle');
  protected readonly message = signal('');

  protected onSubscribe(): void {
    const emailVal = this.email().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailVal || !emailRegex.test(emailVal)) {
      this.status.set('error');
      this.message.set('Please enter a valid email address.');
      return;
    }

    // Mock demonstration state (clearly stated as UI demo)
    this.status.set('success');
    this.message.set('✨ Demo Subscription: Thank you for joining CeylonGo Community!');
    this.email.set('');

    setTimeout(() => {
      this.status.set('idle');
      this.message.set('');
    }, 4500);
  }
}
