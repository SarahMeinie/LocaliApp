import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupEditPage } from './group-edit.page';

const routes: Routes = [
  {
    path: '',
    component: GroupEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupEditPageRoutingModule {}
