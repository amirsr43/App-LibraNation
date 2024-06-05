import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public router: Router,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    this.router.navigateByUrl('login');
  }
}
