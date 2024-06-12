import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment'; // Import environment variables

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

  constructor(private http: HttpClient, private navCtrl: NavController, private alertController: AlertController) {}

  async register() {
    const url = `${environment.apiUrl}/register`; // Use environment variable for the URL
    const data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.http.post(url, data).subscribe(async response => {
      console.log(response);
      
      const successAlert = await this.alertController.create({
        header: 'Registrasi Berhasil',
        message: 'Akun Anda berhasil dibuat. Silakan login.',
        buttons: ['OK']
      });
      await successAlert.present();
      
      this.navCtrl.navigateForward('/login'); // Redirect to login page after successful registration
      
    }, async error => {
      console.error(error);
      
      const errorAlert = await this.alertController.create({
        header: 'Registrasi Gagal',
        message: 'Please check your input and try again.',
        buttons: ['OK']
      });
      await errorAlert.present();
    });
  }
}
