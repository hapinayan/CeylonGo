import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-planner-banner',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-planner-banner.component.html',
  styleUrl: './ai-planner-banner.component.scss',
})
export class AiPlannerBannerComponent {
  protected readonly selectedDestination = signal('');
  protected readonly travelDuration = signal('3 Days');
  protected readonly selectedInterest = signal('');
  protected readonly isGenerating = signal(false);
  protected readonly generatedNotice = signal(false);

  protected readonly destinations = [
    'Cultural Triangle (Sigiriya & Kandy)',
    'Hill Country (Ella & Nuwara Eliya)',
    'Southern Coast (Galle & Mirissa)',
    'Wild & Heritage (Yala & Polonnaruwa)',
    'Northern Peninsula (Jaffna)',
  ];

  protected readonly interests = [
    'Nature & Wildlife',
    'Culture & Heritage',
    'Beach & Surfing',
    'Tea & Hill Country',
    'Ayurveda & Wellness',
  ];

  protected onGenerate(): void {
    this.isGenerating.set(true);
    setTimeout(() => {
      this.isGenerating.set(false);
      this.generatedNotice.set(true);
      setTimeout(() => this.generatedNotice.set(false), 4000);
    }, 1000);
  }
}
