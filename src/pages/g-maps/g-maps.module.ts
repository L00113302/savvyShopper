import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GMapsPage } from './g-maps';

@NgModule({
  declarations: [
    GMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(GMapsPage),
  ],
})
export class GMapsPageModule {}
