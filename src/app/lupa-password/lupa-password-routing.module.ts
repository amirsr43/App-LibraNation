import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LupaPasswordPage } from './lupa-password.page';

const routes: Routes = [
  {
    path: '',
    component: LupaPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LupaPasswordPageRoutingModule {}
