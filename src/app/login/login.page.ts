import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async login() {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'crescent',
    });
    await loading.present();

    // Simulate login delay
    setTimeout(async () => {
      await loading.dismiss();
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;

      // Retrieve user data from localStorage
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      // Dummy login logic
      if (email === storedEmail && password === storedPassword) {
        this.router.navigate(['/tabs/home']);
      } else {
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Invalid email or password.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }, 2000); // Simulate network delay
  }
}
