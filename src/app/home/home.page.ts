import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  totalPeminjaman: number = 0;
  totalDenda: number = 0;
  riwayatDenda: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.checkAuthentication();
    this.firstName = (await this.storage.get('first_name')) || 'Member';
    this.lastName = (await this.storage.get('last_name')) || 'Member';
    this.loadPeminjamanData();
    this.loadDendaData();
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribe(() => {
      if (this.router.url === '/tabs/home') {
        this.exitApp();
      } else {
        this.router.navigate(['/tabs/home']);
      }
    });
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/tabs/home', { replaceUrl: true }); // Directly navigate to home
    }
  }

  async loadPeminjamanData() {
    const userId = await this.storage.get('user_id');
    const token = await this.storage.get('token');
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/peminjaman/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            const formattedData = response.map(item => ({
              ...item,
              created_at: this.formatDate(item.created_at),
              return_date: item.return_date ? this.formatDate(item.return_date) : 'belum dikembalikan'
            }));
            this.totalPeminjaman = formattedData.length;
          }
        },
        (error) => {
          console.error('Error fetching peminjaman data', error);
        }
      );
    } else {
      console.warn('User ID or token not found in storage');
    }
  }

  async loadDendaData() {
    const userId = await this.storage.get('user_id');
    const token = await this.storage.get('token');
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/denda/user/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            this.riwayatDenda = response.map(denda => ({
              ...denda,
              created_at: this.formatDate(denda.created_at),
              tgl_pinjam: this.formatDate(denda.tgl_pinjam),
              tgl_pengembalian: this.formatDate(denda.tgl_pengembalian)
            }));
            this.totalDenda = this.riwayatDenda.length;
          } else {
            console.warn('No fine data found for userId:', userId);
          }
        },
        (error) => {
          if (error.status === 404) {
            console.warn('Fine data not found for userId:', userId);
          } else {
            console.error('Error fetching fine data', error);
          }
        }
      );
    } else {
      console.warn('Token not found in storage');
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadPeminjamanData();
      this.loadDendaData();
      event.target.complete();
    }, 2000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
