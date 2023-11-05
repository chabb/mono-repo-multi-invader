import { Component } from '@angular/core';
import { ConfigComponent } from './config.component';

@Component({
  standalone: true,
  imports: [ConfigComponent],
  selector: 'multi-invader-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'admin';
}
