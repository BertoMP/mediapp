import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private router: Router) {
  }

  goToIndex() {
    this.router.navigate(['/'])
      .then(() => console.log('Navegación a inicio'));
  }
}
