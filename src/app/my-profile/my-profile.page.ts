import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage {

  constructor(private router: Router) {}

  save() {
    // Tambahkan logika logout Anda di sini, misalnya menghapus token, dsb.
    this.router.navigateByUrl('/tabs/profile');
  }

}
