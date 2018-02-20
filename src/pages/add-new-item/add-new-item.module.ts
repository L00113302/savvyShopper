import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewItemPage } from './add-new-item';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    AddNewItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewItemPage),
  ],
  providers: [
    BarcodeScanner
  ]
})
export class AddNewItemPageModule {}