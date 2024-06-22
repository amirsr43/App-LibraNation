import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  book: any;
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.storage.create(); // Initialize storage
    await this.checkAuthentication();
    this.loadBook();
  }

  async checkAuthentication() {
    const token = await this.storage.get('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  loadBook() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.fetchBookDetails(bookId);
    } else {
      this.errorMessage = 'Book ID not found in route';
    }
  }

  async fetchBookDetails(bookId: string) {
    const token = await this.storage.get('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${environment.apiUrl}/books/${bookId}`;

    this.http.get<any>(url, { headers }).subscribe(
      data => {
        this.book = data;
        this.validateBookData(data);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'Book not found';
        } else {
          this.errorMessage = 'An error occurred while loading the book';
        }
        console.error('Error loading book:', error);
      }
    );
  }

  validateBookData(data: any) {
    if (!data.stock) {
      this.errorMessage = 'Stock not found in the book data';
    } else if (!data.stock.jmlh_tersedia) {
      this.errorMessage = 'Jumlah tersedia not found in the stock data';
    }

    if (!data.rack) {
      this.errorMessage = 'Rack not found in the book data';
    } else if (!data.rack.name) {
      this.errorMessage = 'Nama rak not found in the rack data';
    }

    if (!data.cover_link) {
      this.errorMessage = 'Cover link not found in the book data';
    }
  }

  // Handle hardware back button
  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/data-buku']);
    });
  }
}
