import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(private router: Router) {}

  register() {
    // Arahkan ke halaman login setelah klik tombol register
    this.router.navigate(['/login']);
  }
}
