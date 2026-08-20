import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private router = inject(Router);

  navigateToCategory(cat: string) {
    this.router.navigate(['/'], { queryParams: { category: cat } }).then(() => {
      const el = document.getElementById('catalogue');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
