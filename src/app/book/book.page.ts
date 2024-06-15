import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.checkAuthentication();
    this.loadBook();
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
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

  fetchBookDetails(bookId: string) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = `${environment.apiUrl}/books/${bookId}`;

    this.http.get<any>(url, { headers }).subscribe(
      data => {
        console.log('Book data:', data);
        this.book = data;

        if (!data.stock) {
          console.error('Stock tidak ditemukan dalam data buku');
          this.errorMessage = 'Stock not found in the book data';
        } else {
          console.log('Jumlah tersedia:', data.stock.jmlh_tersedia);
          if (!data.stock.jmlh_tersedia) {
            console.error('Jumlah tersedia tidak ditemukan dalam data stock');
            this.errorMessage = 'Jumlah tersedia not found in the stock data';
          }
        }

        if (!data.rack) {
          console.error('Rack tidak ditemukan dalam data buku');
          this.errorMessage = 'Rack not found in the book data';
        } else {
          console.log('Rak:', data.rack.name);
          if (!data.rack.name) {
            console.error('Nama rak tidak ditemukan dalam data rack');
            this.errorMessage = 'Nama rak not found in the rack data';
          }
        }

        if (!data.cover_link) {
          this.errorMessage = 'Cover link not found in the book data';
        }
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
}
