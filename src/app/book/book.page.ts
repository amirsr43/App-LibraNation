import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkAuthentication();
    // You can add any initialization logic here
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

}
