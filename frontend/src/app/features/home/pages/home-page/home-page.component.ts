import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { PopularDestinationsComponent } from '../../components/popular-destinations/popular-destinations.component';
import { FeaturedHomestaysComponent } from '../../components/featured-homestays/featured-homestays.component';
import { LocalExperiencesComponent } from '../../components/local-experiences/local-experiences.component';
import { AiPlannerBannerComponent } from '../../components/ai-planner-banner/ai-planner-banner.component';
import { TourismServicesComponent } from '../../components/tourism-services/tourism-services.component';

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
    TourismServicesComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
