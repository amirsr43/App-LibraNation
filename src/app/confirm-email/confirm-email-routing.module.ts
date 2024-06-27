import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmEmailPage } from './confirm-email.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmEmailPageRoutingModule {}
