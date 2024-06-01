import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(private router: Router) {}

  logout() {
    // Tambahkan logika logout Anda di sini, misalnya menghapus token, dsb.
    this.router.navigateByUrl('/login');
  }
}
