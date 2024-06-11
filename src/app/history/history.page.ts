import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  segment: string = 'peminjaman';

  riwayatPeminjaman = [
    { namaBuku: 'Buku A', namaPeminjam: 'Peminjam 1', tanggalPeminjaman: '2024-05-20' },
    { namaBuku: 'Buku B', namaPeminjam: 'Peminjam 2', tanggalPeminjaman: '2024-05-21' },
    // Tambahkan data riwayat peminjaman lainnya
  ];

  riwayatDenda = [
    { namaPeminjam: 'Peminjam 1', jumlahDenda: 50000 },
    { namaPeminjam: 'Peminjam 2', jumlahDenda: 75000 },
    // Tambahkan data riwayat denda lainnya
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
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

  handleRefresh(event: any) {
    console.log('Refresh event triggered');
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
