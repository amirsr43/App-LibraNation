import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Password dan Konfirmasi Password tidak cocok.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.newPassword.length < 8) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Password minimal harus 8 karakter.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validation passed, continue with API call
    this.http.post('https://lib.libranation.my.id/api/reset-password', {
      reset_token: this.token,
      password: this.newPassword,
      password_confirmation: this.confirmPassword
    }).subscribe(
      async (response: any) => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Password berhasil direset.',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Gagal mereset password.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}
