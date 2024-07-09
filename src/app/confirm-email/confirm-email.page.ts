import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  showAlert: boolean = false;
  alertHeader: string = '';
  alertMessage: string = '';
  alertImage: string = '';

  constructor(
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

  showAlertModal(header: string, message: string, imageType: 'success' | 'error') {
    this.alertHeader = header;
    this.alertMessage = message;
    this.alertImage = imageType === 'success' ? '../../assets/icon/check.gif' : '../../assets/icon/wrong.gif';
    this.showAlert = true;
  }

  closeModal() {
    this.showAlert = false;
  }

  async verifyOTP() {
    const otp = this.otpInputs.join('');
    const url = `${environment.apiUrl}/verify-email`;
    const data = {
      otp: otp,
      email: this.email
    };

    this.http.post(url, data).subscribe(async (response: any) => {
      this.showAlertModal('Verifikasi Berhasil', 'OTP berhasil diverifikasi. Silakan login.', 'success');
      setTimeout(async () => {
        await this.navCtrl.navigateForward('/login');
      }, 5000); // Menunggu 2 detik sebelum navigasi
    }, async error => {
      this.showAlertModal('Verifikasi Gagal', 'Kode OTP salah atau telah kedaluwarsa.', 'error');
    });
  }
}
