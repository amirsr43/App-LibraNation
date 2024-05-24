import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataBukuPageRoutingModule } from './data-buku-routing.module';

import { DataBukuPage } from './data-buku.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataBukuPageRoutingModule
  ],
  declarations: [DataBukuPage]
})
export class DataBukuPageModule {}
