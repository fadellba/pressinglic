import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/components/ui/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SnackbarComponent],
  templateUrl: './app.html',
})
export class App {}