import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { environment } from '../../environments/environment';

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
    private loadingController: LoadingController
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
        console.log('Login response:', response);
        
        // Save user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_id', response.user.id); // Ganti user_id dengan member_id
        localStorage.setItem('first_name', response.user.first_name);
        localStorage.setItem('last_name', response.user.last_name);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('qr_code', `https://lib.libranation.my.id/qrcodes/${response.user.qr_code}`);
 // Simpan URL gambar profil


        console.log('Member ID:', localStorage.getItem('member_id'));
        console.log('QR Code URL:', localStorage.getItem('qr_code'));

        this.navCtrl.navigateForward('/tabs/home');
      },
      async error => {
        await loading.dismiss();
        console.error('Login error:', error);
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
