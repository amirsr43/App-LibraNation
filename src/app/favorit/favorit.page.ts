import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-favorit',
  templateUrl: 'favorit.page.html',
  styleUrls: ['favorit.page.scss']
})
export class FavoritPage implements OnInit {
  favoriteBooks: any[] = [];
  filteredFavoriteBooks: any[] = [];

  constructor(private router: Router, private http: HttpClient, private storage: Storage) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['favoriteBooks']) {
      this.favoriteBooks = navigation.extras.state['favoriteBooks'];
      this.filteredFavoriteBooks = this.favoriteBooks;
    }
  }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.getFavorites();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async getFavorites() {
    const userId = await this.storage.get('user_id');
    const token = await this.storage.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>(`${environment.apiUrl}/users/${userId}/favorites`, { headers }).subscribe(
      data => {
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
      this.getFavorites(); // Refresh favorite data
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
