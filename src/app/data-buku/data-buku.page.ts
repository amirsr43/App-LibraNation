import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSelect, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-data-buku',
  templateUrl: 'data-buku.page.html',
  styleUrls: ['data-buku.page.scss']
})
export class DataBukuPage implements OnInit {
  @ViewChild('categorySelect', { static: false }) categorySelect!: IonSelect;
  selectedCategory: string | undefined;
  selectedCategoryName: string = '';
  categories: any[] = [];
  books: any[] = [];
  filteredBooks: any[] = [];
  favoriteBooks: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Inisialisasi storage
    await this.periksaAutentikasi();
    this.ambilKategori(); // Fetch categories
    this.ambilBuku();
    this.getFavorites(); // Tambahkan ini untuk mengambil daftar favorit
  }

  ionViewWillEnter() {
    this.periksaAutentikasi();
  }

  async periksaAutentikasi() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async ambilKategori() {
    const token = await this.storage.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`${environment.apiUrl}/kategori`, { headers }).subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Kesalahan mengambil kategori:', error);
      }
    );
  }

  async ambilBuku() {
    const token = await this.storage.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`${environment.apiUrl}/books`, { headers }).subscribe(
      data => {
        this.books = data;
        this.filteredBooks = data; // Tampilkan semua buku pada awalnya
        this.syncFavorites(); // Sinkronkan dengan favorit
      },
      error => {
        console.error('Kesalahan mengambil buku:', error);
      }
    );
  }

  async getFavorites() {
    const userId = await this.storage.get('user_id');
    const token = await this.storage.get('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`${environment.apiUrl}/users/${userId}/favorites`, { headers }).subscribe(
      data => {
        this.favoriteBooks = data;
        this.syncFavorites(); // Sinkronkan dengan buku setelah mendapat favorit
      },
      error => {
        console.error('Error fetching favorite books:', error);
      }
    );
  }

  syncFavorites() {
    this.books.forEach(book => {
      book.isLiked = this.favoriteBooks.some(favBook => favBook.id === book.id);
    });
    this.filterBooks(); // Perbarui filteredBooks
  }

  handleRefresh(event: any): void {
    setTimeout(() => {
      this.ambilBuku(); // Segarkan data buku
      this.getFavorites(); // Segarkan data favorit
      event.target.complete();
    }, 2000);
  }

  categorySelected(event: any) {
    this.selectedCategory = event.detail.value;
    this.selectedCategoryName = this.getCategoryName(this.selectedCategory ?? '');
    this.filterBooks();
  }

  categoryCanceled(event: any) {
    this.selectedCategory = undefined;
    this.selectedCategoryName = '';
    this.filteredBooks = this.books; // Tampilkan semua buku saat kategori dibatalkan
    this.categorySelect.value = ''; // Reset nilai category select
    this.categorySelect.placeholder = 'Pilih Kategori'; // Ubah placeholder menjadi "Pilih Kategori"
    this.noBooksFound = false; // Reset pesan tidak ditemukan
  }

  noBooksFound: boolean = false;

  filterBooks(event?: any) {
    const searchTerm = event?.target.value?.toLowerCase() || '';
    if (this.selectedCategory) {
      this.filteredBooks = this.books.filter(book =>
        book.category?.id === this.selectedCategory &&
        book.title.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
      );
    }

    this.noBooksFound = this.filteredBooks.length === 0;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  showFavorites() {
    this.router.navigate(['/favorit'], { state: { favoriteBooks: this.favoriteBooks } });
  }

  async toggleLike(book: any) {
    book.isLiked = !book.isLiked; // Ganti status suka saat ikon diklik
    const userId = await this.storage.get('user_id'); // Atau ambil dari storage
    const token = await this.storage.get('token'); // Ambil token dari storage

    const headers = { 'Authorization': `Bearer ${token}` };

    if (book.isLiked) {
      this.favoriteBooks.push(book);
      this.http.post(`${environment.apiUrl}/users/${userId}/books/${book.id}/favorite`, {}, { headers }).subscribe(
        response => { },
        error => {
          console.error('Error adding to favorites:', error);
        }
      );
    } else {
      this.favoriteBooks = this.favoriteBooks.filter(favBook => favBook.id !== book.id);
      this.http.delete(`${environment.apiUrl}/users/${userId}/books/${book.id}/favorite`, { headers }).subscribe(
        response => { },
        error => {
          console.error('Error removing from favorites:', error);
        }
      );
    }
  }

  // Handle hardware back button
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/home']);
    });
  }
}
