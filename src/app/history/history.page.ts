import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.checkAuthentication();
    this.loadPeminjamanData();
  }

  ionViewWillEnter() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  loadPeminjamanData() {
    const userId = localStorage.getItem('user_id'); // Pastikan user_id tersimpan di localStorage
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/peminjaman/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      console.log(`Fetching data from API: ${apiUrl}`); // Logging API URL
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          console.log('API response:', response); // Logging API response
          if (Array.isArray(response)) {
            this.riwayatPeminjaman = response.map(item => {
              this.loadDendaData(item.id); // Load denda data for each peminjaman
              return {
                ...item,
                created_at: this.formatDate(item.created_at),
                return_date: item.return_date ? this.formatDate(item.return_date) : 'belum dikembalikan'
              };
            });
            console.log('Formatted peminjaman data:', this.riwayatPeminjaman); // Logging formatted data
          } else {
            console.warn('Unexpected API response format:', response); // Warning for unexpected format
          }
        },
        (error) => {
          console.error('Error fetching peminjaman data', error); // Logging error
        }
      );
    } else {
      console.warn('User ID or token not found in localStorage'); // Warning if user_id or token is missing
    }
  }

  loadDendaData(idPeminjaman: number) {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
      const apiUrl = `${environment.apiUrl}/denda/${idPeminjaman}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      console.log(`Fetching denda data from API: ${apiUrl}`); // Logging API URL
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          console.log('Denda API response:', response); // Logging API response
          if (response && response.nama_member) {
            this.riwayatDenda.push({
              ...response,
              created_at: this.formatDate(response.created_at)
            });
            console.log('Formatted denda data:', this.riwayatDenda); // Logging formatted data
          } else {
            console.warn('No denda data found for idPeminjaman or nama_member is null:', idPeminjaman); // Warning for no data found
          }
        },
        (error) => {
          if (error.status === 404) {
            console.warn('Denda data not found for idPeminjaman:', idPeminjaman); // Warning for 404
          } else {
            console.error('Error fetching denda data', error); // Logging error
          }
        }
      );
    } else {
      console.warn('Token not found in localStorage'); // Warning if token is missing
    }
  }

  handleRefresh(event: any) {
    console.log('Refresh event triggered');
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
