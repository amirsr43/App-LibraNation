// lupa-password.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lupa-password',
  templateUrl: './lupa-password.page.html',
  styleUrls: ['./lupa-password.page.scss'],
})
export class LupaPasswordPage {
  email: string = ''; // Inisialisasi properti email dengan string kosong

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async reset() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'circles'
    });
    await loading.present();
    
    this.http.post('https://lib.libranation.my.id/api/forget-password', { email: this.email })
      .subscribe(
        async (response: any) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'Kode token telah dikirim ke email Anda.',
            buttons: ['OK']
          });
          await alert.present();
          this.router.navigate(['/reset-password']);
        },
        async (error) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Kode token gagal dikirim ke email Anda',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
  }
}
