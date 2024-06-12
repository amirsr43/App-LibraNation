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

  filterBooks() {
    if (this.selectedCategory) {
      this.filteredBooks = this.books.filter(book => 
        book.category?.name?.toLowerCase() === this.selectedCategory?.toLowerCase()
      );
    } else {
      this.filteredBooks = this.books;
    }
  }

  showFavorites() {
    this.router.navigate(['/favorit'], { state: { favoriteBooks: this.favoriteBooks } });
  }

  toggleLike(book: any) {
    book.isLiked = !book.isLiked; // Ganti status suka saat ikon diklik
    if (book.isLiked) {
      this.favoriteBooks.push(book);
    } else {
      this.favoriteBooks = this.favoriteBooks.filter(favBook => favBook.id !== book.id);
    }
    console.log('Buku Favorit:', this.favoriteBooks); // Tambahkan log ini
  }
}
