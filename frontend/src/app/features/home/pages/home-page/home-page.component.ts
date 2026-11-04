import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { PopularDestinationsComponent } from '../../components/popular-destinations/popular-destinations.component';
import { FeaturedHomestaysComponent } from '../../components/featured-homestays/featured-homestays.component';
import { LocalExperiencesComponent } from '../../components/local-experiences/local-experiences.component';
import { AiPlannerBannerComponent } from '../../components/ai-planner-banner/ai-planner-banner.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { CommunityTestimonialsComponent } from '../../components/community-testimonials/community-testimonials.component';
import { NewsletterSectionComponent } from '../../components/newsletter-section/newsletter-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    CategoryBarComponent,
    PopularDestinationsComponent,
    FeaturedHomestaysComponent,
    LocalExperiencesComponent,
    AiPlannerBannerComponent,
    WhyChooseComponent,
    CommunityTestimonialsComponent,
    NewsletterSectionComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
