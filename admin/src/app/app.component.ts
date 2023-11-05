import { Component } from '@angular/core';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent],
  selector: 'multi-invader-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin';
}
