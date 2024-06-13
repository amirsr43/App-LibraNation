import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

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
  apiUrl = 'https://lib.libranation.my.id/api/members/';
  isProfileComplete: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.firstName = localStorage.getItem('first_name') || '';
    this.lastName = localStorage.getItem('last_name') || '';
    this.email = localStorage.getItem('email') || '';
    this.loadProfile();
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

  async loadProfile() {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('qr_code');
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
