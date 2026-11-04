import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExperienceItem } from '../../../../shared/models/tourism.models';
import { EXPERIENCES_DATA } from '../../data/home-mock-data';

@Component({
  selector: 'app-local-experiences',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './local-experiences.component.html',
  styleUrl: './local-experiences.component.scss',
})
export class LocalExperiencesComponent {
  protected readonly experiences: ExperienceItem[] = EXPERIENCES_DATA;
}
