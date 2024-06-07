import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LupaPasswordPageRoutingModule } from './lupa-password-routing.module';

import { LupaPasswordPage } from './lupa-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LupaPasswordPageRoutingModule
  ],
  declarations: [LupaPasswordPage]
})
export class LupaPasswordPageModule {}
