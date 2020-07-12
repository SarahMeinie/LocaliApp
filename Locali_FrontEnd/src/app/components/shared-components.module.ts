import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from './map/map.component';
import { ModalNewpostComponent } from './modal-newpost/modal-newpost.component';
import { ModalFilterComponent } from './modal-filter/modal-filter.component'
import { PopoverFilterComponent } from './popover-filter/popover-filter.component'
import { PostTemplateComponent } from './post-template/post-template.component';



@NgModule({
  declarations: [
    MapComponent,
    ModalNewpostComponent,
    ModalFilterComponent,
    PostTemplateComponent,
    PopoverFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class SharedComponentsModule { }
