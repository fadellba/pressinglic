import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon = '🗂️';
  @Input() title = 'Aucun élément';
  @Input() message?: string;
}