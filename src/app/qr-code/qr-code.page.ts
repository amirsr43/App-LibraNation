import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

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
    private alertController: AlertController,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.firstName = await this.storage.get('first_name') || '';
    this.lastName = await this.storage.get('last_name') || '';
    this.email = await this.storage.get('email') || '';
    this.qrCodeUrl = await this.storage.get('qr_code') || '';
    this.loadProfileImage();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async loadProfileImage() {
    try {
      const userId = await this.storage.get('user_id');
      const token = await this.storage.get('token');
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
