import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
})
export class HistoryPage {
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

  constructor() {}
}
