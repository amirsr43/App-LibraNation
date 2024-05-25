import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataBukuPage } from './data-buku.page';
import { DataBukuPageRoutingModule } from './data-buku-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DataBukuPageRoutingModule
  ],
  declarations: [DataBukuPage]
})
export class DataBukuPageModule {}
