import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectStorePage } from './select-store';
import { GMapsPage } from '../g-maps/g-maps';
//import { MyMapPage } from '../my-map/my-map';

@NgModule({
  declarations: [
    SelectStorePage,
    GMapsPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectStorePage),
  ],
})
export class SelectStorePageModule {}
