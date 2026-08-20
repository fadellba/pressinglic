import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() variant: 'light' | 'dark' = 'light';
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get from(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get to(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  goTo(page: number): void {
    const clamped = Math.min(Math.max(1, page), this.totalPages);
    if (clamped !== this.currentPage) {
      this.pageChange.emit(clamped);
    }
  }
}