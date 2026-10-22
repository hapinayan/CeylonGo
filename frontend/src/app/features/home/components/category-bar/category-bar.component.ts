import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';

export interface WhatYouCanDoItem {
  id: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  link: string;
  icon: 'home' | 'map' | 'robot' | 'pin';
}

@Component({
  selector: 'app-category-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeaderComponent],
  templateUrl: './category-bar.component.html',
  styleUrl: './category-bar.component.scss',
})
export class CategoryBarComponent {
  protected readonly items: WhatYouCanDoItem[] = [
    {
      id: 'homestays',
      title: 'Find Homestays',
      description: 'Stay with local families and experience real Sri Lankan hospitality.',
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
      link: '/homestays',
      icon: 'home',
    },
    {
      id: 'experiences',
      title: 'Explore Experiences',
      description: 'Discover local culture, activities and hidden gems.',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      link: '/experiences',
      icon: 'map',
    },
    {
      id: 'ai-planner',
      title: 'AI Travel Planner',
      description: 'Get personalized itineraries based on your interests.',
      iconBg: '#FAF5FF',
      iconColor: '#9333EA',
      link: '/ai-planner',
      icon: 'robot',
    },
    {
      id: 'destinations',
      title: 'Discover Destinations',
      description: 'Explore beautiful places across all 25 districts.',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      link: '/destinations',
      icon: 'pin',
    },
  ];
}
