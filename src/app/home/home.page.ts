import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

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
  riwayatDenda: any[] = [
    { namaPeminjam: 'Peminjam 1', jumlahDenda: 50000 },
    { namaPeminjam: 'Peminjam 2', jumlahDenda: 75000 },
    // Tambahkan data riwayat denda lainnya
  ];

  constructor(private router: Router, private http: HttpClient, private storage: Storage) {}

  async ngOnInit() {
    await this.checkAuthentication();
    this.firstName = (await this.storage.get('first_name')) || 'Member';
    this.lastName = (await this.storage.get('last_name')) || 'Member';
    this.loadPeminjamanData();
    this.totalDenda = this.calculateTotalDenda();
  }

  ionViewWillEnter() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async loadPeminjamanData() {
    const userId = await this.storage.get('user_id'); // Pastikan user_id tersimpan di Ionic Storage
    const token = await this.storage.get('token'); // Ambil token dari Ionic Storage
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/peminjaman/${userId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(apiUrl, { headers }).subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            const formattedData = response.map(item => {
              return {
                ...item,
                created_at: this.formatDate(item.created_at),
                return_date: item.return_date ? this.formatDate(item.return_date) : 'belum dikembalikan'
              };
            });
            this.totalPeminjaman = formattedData.length;
          }
        },
        (error) => {
          console.error('Error fetching peminjaman data', error); // Logging error
        }
      );
    } else {
      console.warn('User ID or token not found in storage'); // Warning if user_id or token is missing
    }
  }

  calculateTotalDenda(): number {
    return this.riwayatDenda.reduce((total, item) => total + item.jumlahDenda, 0);
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadPeminjamanData();
      this.totalDenda = this.calculateTotalDenda();
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
