import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  private lastFocused: HTMLElement | null = null;
  private readonly onKeydown = (event: KeyboardEvent) => this.handleKeydown(event);

  ngAfterViewInit(): void {
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.el.nativeElement.addEventListener('keydown', this.onKeydown);
    this.focusFirst();
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('keydown', this.onKeydown);
    this.lastFocused?.focus();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = this.getFocusable();
    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private getFocusable(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => element.offsetParent !== null);
  }

  private focusFirst(): void {
    this.getFocusable()[0]?.focus();
  }
}