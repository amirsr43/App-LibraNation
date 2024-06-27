import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';

  constructor(
    private http: HttpClient, 
    private navCtrl: NavController, 
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    return loading;
  }

  async register() {
    const loading = await this.presentLoading();

    if (this.password.length < 8 || this.password_confirmation.length < 8) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Password minimal harus 8 karakter.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.password !== this.password_confirmation) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Password dan Konfirmasi Password tidak cocok.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const url = `${environment.apiUrl}/register`;
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.http.post(url, data).subscribe(async response => {
      console.log(response);
      await loading.dismiss();

      const successAlert = await this.alertController.create({
        header: 'Registrasi Berhasil',
        message: 'Silakan masukkan kode OTP yang telah dikirimkan ke email Anda.',
        buttons: ['OK']
      });
      await successAlert.present();
      
      this.navCtrl.navigateForward('/confirm-email');
      
    }, async error => {
      console.error(error);
      await loading.dismiss();

      const errorAlert = await this.alertController.create({
        header: 'Registrasi Gagal',
        message: 'Please check your input and try again.',
        buttons: ['OK']
      });
      await errorAlert.present();
    });
  }
}
