import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  profileImageUrl: string = '';
  apiUrl = `${environment.apiUrl}/members/`;
  isProfileComplete: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.firstName = await this.storage.get('first_name') || '';
    this.lastName = await this.storage.get('last_name') || '';
    this.email = await this.storage.get('email') || '';
    this.loadProfile();
  }

  async ionViewWillEnter() {
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async loadProfile() {
    try {
      const userId = await this.storage.get('user_id');
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response: any = await this.http.get(`${this.apiUrl}${userId}`, { headers }).toPromise();
      this.profileImageUrl = response?.image_profile_url || '';

      this.isProfileComplete = this.checkProfileCompletion(response);
    } catch (error) {
      this.handleError(error, 'Error loading profile');
    }
  }

  checkProfileCompletion(profile: any): boolean {
    return !!profile.member.tgl_lahir && !!profile.member.address && !!profile.member.phone;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadProfile();
      event.target.complete();
    }, 2000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Apakah kamu yakin?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Iya',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.logout();
          }
        },
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.storage.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
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
