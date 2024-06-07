import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  constructor(private router: Router) {}

  login() {
    // Arahkan ke halaman login setelah klik tombol register
    this.router.navigate(['/login']);
  }
}
