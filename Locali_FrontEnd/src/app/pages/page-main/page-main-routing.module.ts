import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageMainPage } from './page-main.page';

const routes: Routes = [
    {
        path: '',
        component: PageMainPage,
        children: [
            {
                path: 'tab-home',
                loadChildren: () => import('../tab-home/tab-home.module').then(m => m.TabHomePageModule)
            },
            {
                path: 'tab-profile',
                loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'tab-map',
                loadChildren: () => import('../map/map.module').then(m => m.MapPageModule)
            },
            {
                path: '',
                redirectTo: 'tab-home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/page-main/tab-home',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageMainPageRoutingModule {}
