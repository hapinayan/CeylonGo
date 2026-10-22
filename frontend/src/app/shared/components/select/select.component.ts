import { Component, input, output, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../models/ui.models';

let uniqueSelectIdCounter = 0;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  readonly label = input<string | undefined>(undefined);
  readonly options = input.required<SelectOption<string>[]>();
  readonly value = input<string | undefined>(undefined);
  readonly placeholder = input<string>('Select an option...');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly selectId = input<string>(`cg-select-${++uniqueSelectIdCounter}`);

  readonly valueChange = output<string>();

  protected readonly isOpen = signal<boolean>(false);

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  protected toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  protected selectOption(option: SelectOption<string>): void {
    if (option.disabled) return;
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  protected get selectedOption(): SelectOption<string> | undefined {
    return this.options().find((opt) => opt.value === this.value());
  }
}
