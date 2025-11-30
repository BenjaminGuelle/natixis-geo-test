import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  inject,
  ElementRef,
  InputSignal, OutputEmitterRef, WritableSignal, Signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'input-search',
  imports: [ReactiveFormsModule],
  templateUrl: './input-search.html',
  styleUrl: './input-search.css',
})
export class InputSearch<T> {
  #elementRef: ElementRef = inject(ElementRef);

  control: InputSignal<FormControl<string | null>> = input.required<FormControl<string | null>>();
  options: InputSignal<T[]> = input<T[]>([]);
  displayWith: InputSignal<(item: T) => string> = input<(item: T) => string>((item) => String(item));
  placeholder: InputSignal<string> = input<string>('');

  selected: OutputEmitterRef<T> = output<T>();

  isOpen: WritableSignal<boolean> = signal(false);
  activeIndex: WritableSignal<number> = signal(-1);

  showDropdown: Signal<boolean> = computed(() => this.isOpen() && this.options().length > 0);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.#elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.activeIndex.set(-1);
    }
  }

  onFocus(): void {
    this.isOpen.set(true);
  }

  onKeydown(event: KeyboardEvent): void {
    const options: T[] = this.options();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update(i => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex() >= 0) {
          this.selectOption(options[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        this.activeIndex.set(-1);
        break;
    }
  }

  selectOption(option: T): void {
    this.selected.emit(option);
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }
}