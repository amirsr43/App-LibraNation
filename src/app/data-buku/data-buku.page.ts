import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-buku',
  templateUrl: 'data-buku.page.html',
  styleUrls: ['data-buku.page.scss']
})
export class DataBukuPage implements OnInit {
  @ViewChild('categorySelect', { static: false }) categorySelect!: IonSelect;
  selectedCategory: string | undefined;
  books: any[] = [];
  filteredBooks: any[] = [];
  favoriteBooks: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.periksaAutentikasi();
    this.ambilBuku();
  }

  ionViewWillEnter() {
    this.periksaAutentikasi();
  }

  periksaAutentikasi() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  ambilBuku() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
  
    this.http.get<any[]>('https://lib.libranation.my.id/api/books', { headers }).subscribe(
      data => {
        console.log('Data Buku:', data);
        this.books = data;
        this.filteredBooks = data; // Tampilkan semua buku pada awalnya
      },
      error => {
        console.error('Kesalahan mengambil buku:', error);
      }
    );
  }

  handleRefresh(event: any): void {
    setTimeout(() => {
      this.ambilBuku(); // Segarkan data buku
      event.target.complete();
    }, 2000);
  }

  categorySelected(event: any) {
    this.selectedCategory = event.detail.value;
    this.filterBooks();
  }

  categoryCanceled(event: any) {
    this.selectedCategory = undefined;
    this.filteredBooks = this.books; // Tampilkan semua buku saat kategori dibatalkan
  }

  filterBooks(event?: any) {
    const searchTerm = event?.target.value?.toLowerCase() || '';
    if (this.selectedCategory) {
      this.filteredBooks = this.books.filter(book =>
        book.category?.name?.toLowerCase() === this.selectedCategory?.toLowerCase() &&
        book.title.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
      );
    }
  }

  showFavorites() {
    this.router.navigate(['/favorit'], { state: { favoriteBooks: this.favoriteBooks } });
  }

  toggleLike(book: any) {
    book.isLiked = !book.isLiked; // Ganti status suka saat ikon diklik
    const userId = localStorage.getItem('user_id'); // Atau ambil dari token jika ada
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

    if (book.isLiked) {
      this.favoriteBooks.push(book);
      const headers = { 'Authorization': `Bearer ${token}` }; // Sertakan token dalam header
      this.http.post(`https://lib.libranation.my.id/api/users/${userId}/books/${book.id}/favorite`, {}, { headers }).subscribe(
        response => {
          console.log('Added to favorites:', response);
        },
        error => {
          console.error('Error adding to favorites:', error);
        }
      );
    } else {
      this.favoriteBooks = this.favoriteBooks.filter(favBook => favBook.id !== book.id);
      const headers = { 'Authorization': `Bearer ${token}` }; // Sertakan token dalam header
      this.http.delete(`https://lib.libranation.my.id/api/users/${userId}/books/${book.id}/favorite`, { headers }).subscribe(
        response => {
          console.log('Removed from favorites:', response);
        },
        error => {
          console.error('Error removing from favorites:', error);
        }
      );
    }
    console.log('Buku Favorit:', this.favoriteBooks); // Tambahkan log ini
  }

  ngAfterViewInit() {
    // Remove the unnecessary event listener
  }
}
