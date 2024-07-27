import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController, IonLoading } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  tokenPart1: string = '';
  tokenPart2: string = '';
  tokenPart3: string = '';
  tokenPart4: string = '';
  tokenPart5: string = '';

  private resetToken: string = ''; // This will store the full reset token

  @ViewChild('loading', { static: false }) loading!: IonLoading;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Retrieve the reset token from the route parameters or query params
    this.activatedRoute.queryParams.subscribe(params => {
      this.resetToken = params['reset_token'] || ''; // Get the reset token from query params
      if (this.resetToken.length >= 5) {
        this.tokenPart1 = this.resetToken.charAt(0);
        this.tokenPart2 = this.resetToken.charAt(1);
        this.tokenPart3 = this.resetToken.charAt(2);
        this.tokenPart4 = this.resetToken.charAt(3);
        this.tokenPart5 = this.resetToken.charAt(4);
      }
    });
  }

  validateInput(event: any, nextElementId: string) {
    const value = event.target.value;

    // Hapus karakter yang bukan angka
    event.target.value = value.replace(/[^\d]/g, '');

    // Jika input sudah memiliki satu karakter, fokuskan ke elemen berikutnya
    if (event.target.value.length === 1) {
      const nextElement = document.getElementById(nextElementId);
      if (nextElement) {
        (nextElement as HTMLIonInputElement).setFocus();
      }
    }
  }

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

    const token = this.tokenPart1 + this.tokenPart2 + this.tokenPart3 + this.tokenPart4 + this.tokenPart5;

    // Show the loading spinner
    await this.loading.present();

    // Validation passed, continue with API call
    this.http.post('https://lib.libranation.my.id/api/reset-password', {
      reset_token: token,
      password: this.newPassword,
      password_confirmation: this.confirmPassword
    }).subscribe(
      async (response: any) => {
        console.log('Response:', response);  // Log the response
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Password berhasil direset.',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/login']);
        await this.loading.dismiss();
      },
      async (error) => {
        console.log('Error:', error);  // Log the error
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Gagal mereset password. Silakan coba lagi.',
          buttons: ['OK']
        });
        await alert.present();
        await this.loading.dismiss();
      }
    );
  }
}
