import { Component, input, output, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

let uniqueInputIdCounter = 0;

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  readonly label = input<string | undefined>(undefined);
  readonly inputId = input<string>(`cg-input-${++uniqueInputIdCounter}`);
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly hintMessage = input<string | undefined>(undefined);

  readonly valueChange = output<string>();

  protected readonly innerValue = signal<string>('');
  protected readonly isFocused = signal<boolean>(false);
  protected readonly isPasswordVisible = signal<boolean>(false);

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: unknown): void {
    this.innerValue.set(val !== null && val !== undefined ? String(val) : '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Disabled handled via input signal or form control
  }

  protected handleInput(val: string): void {
    this.innerValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  protected handleBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  protected handleFocus(): void {
    this.isFocused.set(true);
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected get effectiveType(): string {
    if (this.type() === 'password') {
      return this.isPasswordVisible() ? 'text' : 'password';
    }
    return this.type();
  }
}
