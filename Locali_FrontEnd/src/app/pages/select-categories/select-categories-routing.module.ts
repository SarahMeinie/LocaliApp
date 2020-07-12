import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectCategoriesPage } from './select-categories.page';

const routes: Routes = [
  {
    path: '',
    component: SelectCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCategoriesPageRoutingModule {}
