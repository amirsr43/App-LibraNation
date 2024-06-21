import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

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
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
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
    const userId = await this.storage.get('user_id'); // Ensure user_id is stored in storage
    const token = await this.storage.get('token'); // Get token from storage
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/peminjaman/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            this.riwayatPeminjaman = response.map(item => {
              this.loadDendaData(item.id); // Load fine data for each loan
              return {
                ...item,
                created_at: this.formatDate(item.created_at),
                return_date: item.return_date ? this.formatDate(item.return_date) : 'belum dikembalikan'
              };
            });
          } else {
            console.warn('Unexpected API response format:', response); // Warning for unexpected format
          }
        },
        (error) => {
          console.error('Error fetching loan data', error); // Logging error
        }
      );
    } else {
      console.warn('User ID or token not found in storage'); // Warning if user_id or token is missing
    }
  }

  async loadDendaData(idPeminjaman: number) {
    const token = await this.storage.get('token'); // Get token from storage
    if (token) {
      const apiUrl = `${environment.apiUrl}/denda/${idPeminjaman}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (response && response.nama_member) {
            this.riwayatDenda.push({
              ...response,
              created_at: this.formatDate(response.created_at)
            });
          } else {
            console.warn('No fine data found for idPeminjaman or nama_member is null:', idPeminjaman); // Warning for no data found
          }
        },
        (error) => {
          if (error.status === 404) {
            console.warn('Fine data not found for idPeminjaman:', idPeminjaman); // Warning for 404
          } else {
            console.error('Error fetching fine data', error); // Logging error
          }
        }
      );
    } else {
      console.warn('Token not found in storage'); // Warning if token is missing
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadPeminjamanData();
      event.target.complete();
    }, 2000);
  }

  // Function to format date to dd/mm/yyyy
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
