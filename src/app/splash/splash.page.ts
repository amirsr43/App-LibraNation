import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(
    private router: Router,
    private storage: Storage
  ) {
    setTimeout(async () => {
      await this.storage.create();
      const token = await this.storage.get('token');
      if (token) {
        this.router.navigateByUrl('/tabs/home');
      } else {
        this.router.navigateByUrl('/welcome');
      }
    }, 2000);
  }

  ngOnInit() {
  }

}
