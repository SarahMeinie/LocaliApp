import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageMainPageRoutingModule } from './page-main-routing.module';
import { PageMainPage } from './page-main.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageMainPageRoutingModule
  ],
  declarations: [PageMainPage]
})
export class PageMainPageModule {}
