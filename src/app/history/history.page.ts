import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  segment: string = 'peminjaman';
  riwayatPeminjaman: any[] = [];
  riwayatDenda: any[] = [
    { namaPeminjam: 'Peminjam 1', jumlahDenda: 50000 },
    { namaPeminjam: 'Peminjam 2', jumlahDenda: 75000 },
    // Tambahkan data riwayat denda lainnya
  ];

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
      const apiUrl = `https://lib.libranation.my.id/api/peminjaman/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      console.log(`Fetching data from API: ${apiUrl}`); // Logging API URL
      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          console.log('API response:', response); // Logging API response
          if (Array.isArray(response)) {
            // Filter out items with a non-null return_date
            this.riwayatPeminjaman = response.filter(item => item.return_date === null);
            // Convert dates to dd/mm/yyyy format
            this.riwayatPeminjaman.forEach(item => {
              item.created_at = this.formatDate(item.created_at);
              item.return_date = this.formatDate(item.return_date);
            });
            console.log('Filtered and formatted peminjaman data:', this.riwayatPeminjaman); // Logging formatted data
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
