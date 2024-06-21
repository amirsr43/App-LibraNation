import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
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

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: Storage
  ) {}

  async login() {
    const url = `${environment.apiUrl}/login`;
    const data = {
      email: this.email,
      password: this.password
    };

    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();

    this.http.post(url, data).subscribe(
      async (response: any) => {
        await loading.dismiss();

        // Simpan data pengguna ke storage
        await this.storage.set('token', response.token);
        await this.storage.set('user_id', response.user.id); // Ganti user_id dengan member_id
        await this.storage.set('first_name', response.user.first_name);
        await this.storage.set('last_name', response.user.last_name);
        await this.storage.set('email', response.user.email);
        await this.storage.set('qr_code', `https://lib.libranation.my.id/qrcodes/${response.user.qr_code}`);

        this.navCtrl.navigateForward('/tabs/home');
      },
      async error => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Email or password is incorrect.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}
