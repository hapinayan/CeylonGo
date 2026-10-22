import { Component, input, output, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnDestroy {
  readonly placeholder = input<string>('Search homestays, destinations, experiences...');
  readonly initialValue = input<string>('');
  readonly debounceMs = input<number>(300);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly fullWidth = input<boolean>(true);

  readonly search = output<string>();
  readonly searchSubmit = output<string>();
  readonly clear = output<void>();

  protected readonly query = signal<string>('');
  private readonly searchSubject = new Subject<string>();
  private readonly sub: Subscription;

  constructor() {
    effect(() => {
      const init = this.initialValue();
      if (init !== this.query()) {
        this.query.set(init);
      }
    });

    this.sub = this.searchSubject
      .pipe(debounceTime(this.debounceMs()), distinctUntilChanged())
      .subscribe((val) => {
        this.search.emit(val);
      });
  }

  protected onInput(val: string): void {
    this.query.set(val);
    this.searchSubject.next(val);
  }

  protected onSubmit(): void {
    this.searchSubmit.emit(this.query());
  }

  protected onClear(): void {
    this.query.set('');
    this.searchSubject.next('');
    this.clear.emit();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
