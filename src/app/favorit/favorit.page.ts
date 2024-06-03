import { Component } from '@angular/core';

@Component({
  selector: 'app-favorit',
  templateUrl: 'favorit.page.html',
  styleUrls: ['favorit.page.scss']
})
export class FavoritPage {
  public favoriteBooks: { title: string, author: string }[] = [
    { title: 'Buku Favorit 1', author: 'Penulis 1' },
    { title: 'Buku Favorit 2', author: 'Penulis 2' },
    { title: 'Buku Favorit 3', author: 'Penulis 3' },
    { title: 'Buku Favorit 4', author: 'Penulis 4' },
    { title: 'Buku Favorit 5', author: 'Penulis 5' },
    { title: 'Buku Favorit 6', author: 'Penulis 6' },
    { title: 'Buku Favorit 7', author: 'Penulis 7' }
  ];

  constructor() {}

  public handleRefresh(event: any): void {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
}
