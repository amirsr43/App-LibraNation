import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  async register() {
    const loading = await this.loadingController.create({
      message: 'Registering...',
      spinner: 'crescent',
    });
    await loading.present();

    // Simulate registration delay
    setTimeout(async () => {
      await loading.dismiss();
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

      if (password !== confirmPassword) {
        const alert = await this.alertController.create({
          header: 'Registration Failed',
          message: 'Passwords do not match.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      }

      // Save user data to localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);

      const alert = await this.alertController.create({
        header: 'Registration Successful',
        message: 'Your account has been created.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/login']);
            },
          },
        ],
      });
      await alert.present();
    }, 2000); // Simulate network delay
  }
}
