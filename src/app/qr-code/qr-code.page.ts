import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  qrCodeUrl: string = '';
  profileImageUrl: string = '';
  countdown: number = 0;
  apiUrl = 'https://lib.libranation.my.id/api/members/';
  updateQrCodeUrl = 'https://lib.libranation.my.id/api/update-qrcodes/';
  countdownSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private storage: Storage,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.firstName = await this.storage.get('first_name') || '';
    this.lastName = await this.storage.get('last_name') || '';
    this.email = await this.storage.get('email') || '';
    this.qrCodeUrl = await this.storage.get('qr_code') || '';
    this.loadProfileImage();

    // Subscribe to hardware back button
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/profile']);
    });
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

  async updateQrCode() {
    try {
      const userId = await this.storage.get('user_id');
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response: any = await this.http.post(`${this.updateQrCodeUrl}${userId}`, {}, { headers }).toPromise();
      this.qrCodeUrl = response?.qr_code_url || '';
      await this.storage.set('qr_code', this.qrCodeUrl); // Update QR code in storage
    } catch (error) {
      this.handleError(error, 'Error updating QR code');
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadProfileImage();
      event.target.complete();
    }, 2000);
  }

  onUpdateButtonClick() {
    this.updateQrCode();
    this.startCountdown();
  }

  startCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdown = 60;
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdownSubscription?.unsubscribe();
      }
    });
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

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  // Handle hardware back button
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/profile']);
    });
  }
}
