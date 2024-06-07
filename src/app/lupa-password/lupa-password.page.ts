import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lupa-password',
  templateUrl: './lupa-password.page.html',
  styleUrls: ['./lupa-password.page.scss'],
})
export class LupaPasswordPage {
  constructor(private router: Router) {}

  reset() {
    // Arahkan ke halaman /tabs/home setelah klik tombol login
    this.router.navigate(['/reset-password']);
  }
}

