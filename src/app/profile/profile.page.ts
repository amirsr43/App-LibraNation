import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(private router: Router) {}

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  logout() {
    // Tambahkan logika logout Anda di sini, misalnya menghapus token, dsb.
    // Contoh: localStorage.removeItem('authToken');
    this.router.navigateByUrl('/login');
  }

  public alertButtons = [
    {
      text: 'No',
      role: 'cancel',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.logout();
      }
    },
  ];
}
