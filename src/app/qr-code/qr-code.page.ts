import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  qrCodeUrl: string = '';
  profileImageUrl: string = '';
  apiUrl = 'https://lib.libranation.my.id/api/members/';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.checkAuthentication();
    this.firstName = localStorage.getItem('first_name') || '';
    this.lastName = localStorage.getItem('last_name') || '';
    this.email = localStorage.getItem('email') || '';
    this.qrCodeUrl = localStorage.getItem('qr_code') || '';
    this.loadProfileImage();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async loadProfileImage() {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response: any = await this.http.get(`${this.apiUrl}${userId}`, { headers }).toPromise();
      this.profileImageUrl = response?.image_profile_url || '';
    } catch (error) {
      this.handleError(error, 'Error loading profile image');
    }
  }

  private async handleError(error: any, defaultErrorMessage: string) {
    let message = defaultErrorMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        message = error.error.message;
      } else {
        message = error.error?.message || defaultErrorMessage;
      }
    } else {
      message = error?.message || defaultErrorMessage;
    }
    console.error(message);
    this.presentErrorAlert(message);
  }

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
