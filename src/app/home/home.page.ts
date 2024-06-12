import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firstName: string = ''; // Inisialisasi di sini
  lastName: string = ''; // Inisialisasi di sini

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.firstName = localStorage.getItem('first_name') || 'Member';
    this.lastName = localStorage.getItem('last_name') || 'Member';
  }

  ionViewWillEnter() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  handleRefresh(event: any) {
    console.log('Refresh event triggered');
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
