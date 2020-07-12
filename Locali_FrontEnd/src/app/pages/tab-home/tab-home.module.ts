import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TabHomePage } from './tab-home.page';
import { TabHomePageRoutingModule } from './tab-home-routing.module';
import { PostTemplateComponent } from 'src/app/components/post-template/post-template.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabHomePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [
    TabHomePage,
    PostTemplateComponent
  ],
  entryComponents: [
    PostTemplateComponent
  ]
})
export class TabHomePageModule {}
