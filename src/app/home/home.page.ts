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
  riwayatDenda: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Ensure Ionic Storage is initialized
    await this.checkAuthentication(); // Check user authentication
    this.firstName = (await this.storage.get('first_name')) || 'Member'; // Retrieve user's first name
    this.lastName = (await this.storage.get('last_name')) || 'Member'; // Retrieve user's last name
    this.loadPeminjamanData(); // Load loan data
    this.loadDendaData(); // Load fine data
  }

  ionViewWillEnter() {
    this.checkAuthentication(); // Check authentication again on view enter
  }

  async checkAuthentication() {
    const token = await this.storage.get('token'); // Retrieve token from storage
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Redirect to login if token is missing
    }
  }

  async loadPeminjamanData() {
    const userId = await this.storage.get('user_id'); // Retrieve user ID from storage
    const token = await this.storage.get('token'); // Retrieve token from storage
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/peminjaman/${userId}`; // API URL for loans
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
            this.totalPeminjaman = formattedData.length; // Set totalPeminjaman based on fetched data
          }
        },
        (error) => {
          console.error('Error fetching peminjaman data', error); // Log error if fetching fails
        }
      );
    } else {
      console.warn('User ID or token not found in storage'); // Log warning if user ID or token is missing
    }
  }

  async loadDendaData() {
    const userId = await this.storage.get('user_id'); // Retrieve user ID from storage
    const token = await this.storage.get('token'); // Retrieve token from storage
    if (userId && token) {
      const apiUrl = `${environment.apiUrl}/denda/user/${userId}`; // API URL for fines
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
            this.totalDenda = this.riwayatDenda.length; // Set totalDenda based on the number of fines
          } else {
            console.warn('No fine data found for userId:', userId); // Log warning if no fine data found
          }
        },
        (error) => {
          if (error.status === 404) {
            console.warn('Fine data not found for userId:', userId); // Log warning if fine data not found
          } else {
            console.error('Error fetching fine data', error); // Log error if fetching fails
          }
        }
      );
    } else {
      console.warn('Token not found in storage'); // Log warning if token is missing
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadPeminjamanData(); // Refresh loan data
      this.loadDendaData(); // Refresh fine data
      event.target.complete(); // Complete the refresh event
    }, 2000);
  }

  // Function to format date to dd/mm/yyyy
  formatDate(dateString: string): string {
    if (!dateString) return ''; // Return empty string if dateString is falsy
    const date = new Date(dateString); // Create Date object from dateString
    const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
    const year = date.getFullYear(); // Get full year
    return `${day}/${month}/${year}`; // Return formatted date string dd/mm/yyyy
  }
}
