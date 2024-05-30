import { Component, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-buku',
  templateUrl: 'data-buku.page.html',
  styleUrls: ['data-buku.page.scss']
})
export class DataBukuPage {
  @ViewChild('genreSelect', { static: false }) genreSelect!: IonSelect;
  selectedGenre: string | undefined;
  isLiked: boolean = false;

  books = [
    { title: 'Judul 1', author: 'Penulis 1', category: 'Kategori 1', thumbnail: '../../assets/icon/buku.png', isLiked: false },
    { title: 'Judul 2', author: 'Penulis 2', category: 'Kategori 2', thumbnail: '../../assets/icon/buku.png', isLiked: false },
    { title: 'Judul 3', author: 'Penulis 3', category: 'Kategori 3', thumbnail: '../../assets/icon/buku.png', isLiked: false },
    { title: 'Judul 4', author: 'Penulis 4', category: 'Kategori 4', thumbnail: '../../assets/icon/buku.png', isLiked: false }
  ];

  constructor(private router: Router) {}

  openGenreSelect() {
    this.genreSelect.open();
  }

  genreSelected(event: any) {
    this.selectedGenre = event.detail.value;
    console.log('Selected Genre:', this.selectedGenre);
    // Add logic to process the selected genre, e.g., load related book data
  }

  showFavorites() {
    this.router.navigate(['/favorit']);
  }

  toggleLike(book: any) {
    book.isLiked = !book.isLiked; // Toggle like status when icon is clicked
  }
}
