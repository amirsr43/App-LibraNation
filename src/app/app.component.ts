import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    const loading = await this.showLoading();
    // Simulate a delay for the loading screen
    setTimeout(() => {
      loading.dismiss();
    }, 1000); // 3 seconds delay
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Tunggu blok',
      spinner: 'crescent', // spinner type
      cssClass: 'custom-loading',
      backdropDismiss: false
    });
    await loading.present();
    return loading;
  }
}
