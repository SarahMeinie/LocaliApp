import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCategoriesPageRoutingModule } from './select-categories-routing.module';

import { SelectCategoriesPage } from './select-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCategoriesPageRoutingModule
  ],
  declarations: [SelectCategoriesPage]
})
export class SelectCategoriesPageModule {}
