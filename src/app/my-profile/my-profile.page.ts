import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage {
  profileImage: string = '../../assets/icon/profile.jpg';

  constructor(private router: Router) {}

  selectImage() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    // Implementasikan logika untuk menyimpan perubahan profil di sini
    // Misalnya, kirim data ke server atau simpan di local storage
    this.router.navigateByUrl('/tabs/profile');
  }
}
