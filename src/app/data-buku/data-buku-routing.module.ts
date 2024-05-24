import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataBukuPage } from './data-buku.page';

const routes: Routes = [
  {
    path: '',
    component: DataBukuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataBukuPageRoutingModule {}
