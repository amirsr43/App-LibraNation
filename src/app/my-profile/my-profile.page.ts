import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  tglLahir: string = '';
  address: string = '';
  phone: string = '';
  imageProfile: File | null = null;
  profileImageUrl: string = '';
  isLoading = false;
  apiUrl = `${environment.apiUrl}/members/`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadProfile();
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

      this.tglLahir = response.member.tgl_lahir || '';
      this.address = response.member.address || '';
      this.phone = response.member.phone || '';
      this.profileImageUrl = response?.image_profile_url || '';
    } catch (error) {
      this.handleError(error, 'Error loading profile');
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageProfile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.imageProfile);
    }
  }

  async save() {
    this.isLoading = true;
    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingCtrl.create({
        message: 'Loading...',
      });
      await loading.present();

      const profileData = new FormData();
      profileData.append('tgl_lahir', this.tglLahir);
      profileData.append('address', this.address);
      profileData.append('phone', this.phone);
      if (this.imageProfile) {
        profileData.append('imageProfile', this.imageProfile);
      }

      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response: any = await this.http.post(`${this.apiUrl}${userId}`, profileData, { headers }).toPromise();
      console.log('Profile saved successfully:', response);
      if (this.profileImageUrl) {
        localStorage.setItem('profileImage', this.profileImageUrl);
        localStorage.setItem('tgl_lahir', this.tglLahir);
        localStorage.setItem('phone', this.phone);
        localStorage.setItem('address', this.address);
      }

      await this.presentSuccessAlert('Data berhasil disimpan, silahkan refresh');
      this.router.navigateByUrl('/tabs/profile');
    } catch (error) {
      this.handleError(error, 'Error saving profile');
    } finally {
      this.isLoading = false;
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  checkProfileCompletion(): boolean {
    return !!this.tglLahir && !!this.address && !!this.phone;
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
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentSuccessAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
