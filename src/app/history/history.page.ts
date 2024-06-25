import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  segment: string = 'peminjaman';
  riwayatPeminjaman: any[] = [];
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
    this.loadPeminjamanData();
  }

  async ionViewWillEnter() {
    await this.checkAuthentication();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
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
            this.riwayatPeminjaman = response.map(item => ({
              ...item,
              created_at: this.formatDate(item.created_at),
              return_date: item.return_date ? this.formatDate(item.return_date) : 'belum dikembalikan'
            }));
            this.loadDendaData(userId); // Load fine data for the user
          } else {
            console.warn('Unexpected API response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching loan data', error);
        }
      );
    } else {
      console.warn('User ID or token not found in storage');
    }
  }

  async loadDendaData(userId: number) {
    const token = await this.storage.get('token');
    if (token) {
      const apiUrl = `${environment.apiUrl}/denda/user/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            // Filter out the fines that are already paid
            const unpaidFines = response.filter(denda => denda.status !== 'lunas');
  
            this.riwayatDenda = unpaidFines.map(denda => ({
              ...denda,
              created_at: this.formatDate(denda.created_at),
              tgl_pinjam: this.formatDate(denda.tgl_pinjam),
              tgl_pengembalian: this.formatDate(denda.tgl_pengembalian)
            }));
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

  isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // Handle hardware back button
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/home']);
    });
  }
}
