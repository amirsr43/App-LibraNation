import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage {
  otpInputs: string[] = ['', '', '', '', ''];
  email: string = '';

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('registeredEmail') || '';
  }

  onInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length > 1) {
      input.value = value.charAt(0);
    }

    this.otpInputs[index] = value.charAt(0);

    if (input.value.length === 1 && index < this.otpInputs.length - 1) {
      const nextInput = document.getElementById('otp-input-' + (index + 1)) as HTMLInputElement;
      if (nextInput) {
        nextInput.value = '';
        nextInput.focus();
      }
    } else if (input.value.length === 0 && index < this.otpInputs.length - 1) {
      const nextInput = document.getElementById('otp-input-' + (index + 1)) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && index > 0 && !input.value) {
      const previousInput = document.getElementById('otp-input-' + (index - 1)) as HTMLInputElement;
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  validateInput(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  async verifyOTP() {
    const otp = this.otpInputs.join('');
    const url = `${environment.apiUrl}/verify-email`;
    const data = {
      otp: otp,
      email: this.email
    };

    this.http.post(url, data).subscribe(async (response: any) => {
      const successAlert = await this.alertController.create({
        header: 'Verifikasi Berhasil',
        message: `OTP berhasil diverifikasi. Silakan login.`,
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });
      await successAlert.present();

      this.navCtrl.navigateForward('/login');

    }, async error => {
      const errorAlert = await this.alertController.create({
        header: 'Verifikasi Gagal',
        message: `Kode OTP salah atau telah kedaluwarsa.`,
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });
      await errorAlert.present();
    });
  }
}
