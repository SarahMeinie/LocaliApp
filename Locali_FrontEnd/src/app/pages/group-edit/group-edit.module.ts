import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupEditPageRoutingModule } from './group-edit-routing.module';

import { GroupEditPage } from './group-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupEditPageRoutingModule
  ],
  declarations: [GroupEditPage]
})
export class GroupEditPageModule {}
