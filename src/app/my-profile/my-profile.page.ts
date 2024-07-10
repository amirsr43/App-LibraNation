import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

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
    private alertCtrl: AlertController,
    private storage: Storage,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.loadProfile();

    // Handle hardware back button
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

  async loadProfile() {
    try {
      const userId = await this.storage.get('user_id');
      const token = await this.storage.get('token');
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

  isFormValid(): boolean {
    return this.tglLahir.trim() !== '' && this.address.trim() !== '' && this.phone.trim() !== '';
  }

  async save() {
    this.isLoading = true;
    try {
      const profileData = new FormData();
      profileData.append('tgl_lahir', this.tglLahir);
      profileData.append('address', this.address);
      profileData.append('phone', this.phone);
      if (this.imageProfile) {
        profileData.append('imageProfile', this.imageProfile);
      }

      const userId = await this.storage.get('user_id');
      const token = await this.storage.get('token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Tambahkan delay selama 3 detik
      await new Promise(resolve => setTimeout(resolve, 5000));

      const response: any = await this.http.post(`${this.apiUrl}${userId}`, profileData, { headers }).toPromise();
      if (this.profileImageUrl) {
        await this.storage.set('profileImage', this.profileImageUrl);
        await this.storage.set('tgl_lahir', this.tglLahir);
        await this.storage.set('phone', this.phone);
        await this.storage.set('address', this.address);
      }

      await this.presentSuccessAlert('Data berhasil disimpan, silahkan refresh');
      this.router.navigateByUrl('/tabs/profile');
    } catch (error) {
      this.handleError(error, 'Error saving profile');
    } finally {
      this.isLoading = false;
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

  // Handle hardware back button
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/profile']);
    });
  }
}
