import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertController: AlertController,
    private storage: Storage,
    private platform: Platform
  ) {
    // Subscribe to the back button event
    this.platform.backButton.subscribe(() => {
      this.exitApp();
    });
  }

  async login() {
    const url = `${environment.apiUrl}/login`;
    const data = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    this.http.post(url, data).subscribe(
      async (response: any) => {
        this.isLoading = false;

        // Simpan data pengguna ke storage
        await this.storage.set('token', response.token);
        await this.storage.set('user_id', response.user.id);
        await this.storage.set('first_name', response.user.first_name);
        await this.storage.set('last_name', response.user.last_name);
        await this.storage.set('email', response.user.email);
        await this.storage.set('qr_code', `https://lib.libranation.my.id/qrcodes/${response.user.qr_code}`);

        // Arahkan ke halaman utama setelah login berhasil
        this.navCtrl.navigateRoot('/tabs/home');
      },
      async error => {
        this.isLoading = false;
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Email or password is incorrect.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  exitApp() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        (window as any).navigator.app.exitApp();
      });
    } else {
      // Handle other platforms
      console.error('Exit app not supported on this platform');
    }
  }
}
