import { Component } from '@angular/core';

@Component({
  selector: 'app-favorit',
  templateUrl: 'favorit.page.html',
  styleUrls: ['favorit.page.scss']
})
export class FavoritPage {
  favoriteBooks = [
    { title: 'Buku Favorit 1', author: 'Penulis 1' },
    { title: 'Buku Favorit 2', author: 'Penulis 2' },
    { title: 'Buku Favorit 3', author: 'Penulis 3' }
  ];

  constructor() {}
}
