import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritPage } from './favorit.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritPageRoutingModule {}
