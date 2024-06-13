import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-favorit',
  templateUrl: 'favorit.page.html',
  styleUrls: ['favorit.page.scss']
})
export class FavoritPage implements OnInit {
  favoriteBooks: any[] = [];
  filteredFavoriteBooks: any[] = [];

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['favoriteBooks']) {
      this.favoriteBooks = navigation.extras.state['favoriteBooks'];
      this.filteredFavoriteBooks = this.favoriteBooks;
    }
  }

  ngOnInit() {
    this.checkAuthentication();
    this.getFavorites();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  getFavorites() {
    const userId = localStorage.getItem('user_id'); // Atau ambil dari token jika ada
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`https://lib.libranation.my.id/api/users/${userId}/favorites`, { headers }).subscribe(
      data => {
        console.log('Favorite Books:', data);
        this.favoriteBooks = data;
        this.filteredFavoriteBooks = this.favoriteBooks;
      },
      error => {
        console.error('Error fetching favorite books:', error);
      }
    );
  }

  handleRefresh(event: any): void {
    setTimeout(() => {
      this.getFavorites(); // Segarkan data favorit
      event.target.complete();
    }, 2000);
  }

  filterFavorites(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredFavoriteBooks = this.favoriteBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm)
    );
  }
}
