import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  constructor(private router: Router) {}

  navigate(path: string) {
    const content = document.querySelector('ion-content');
    if (content) {
      content.classList.add('fade-out');
      setTimeout(() => {
        this.router.navigate([path]);
      }, 500); // Sesuaikan dengan durasi animasi fade-out
    }
  }
}
