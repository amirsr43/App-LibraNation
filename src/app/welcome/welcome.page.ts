import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    // Tambahkan listener untuk tombol kembali
    this.platform.backButton.subscribe(() => {
      this.exitApp();
    });
  }

  navigate(path: string) {
    const content = document.querySelector('ion-content');
    if (content) {
      content.classList.add('fade-out');
      setTimeout(() => {
        this.router.navigate([path]);
      }, 500); // Sesuaikan dengan durasi animasi fade-out
    }
  }

  exitApp() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        (window as any).navigator.app.exitApp();
      });
    } else {
      // Handle other platforms
      console.error('Exit app not supported on this platform');
    }
  }

}
