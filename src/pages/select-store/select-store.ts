import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GMapsPage } from '../g-maps/g-maps';
//import { MyMapPage } from '../my-map/my-map';

/**
 * Generated class for the SelectStorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-store',
  templateUrl: 'select-store.html',
})
export class SelectStorePage {

  static get parameters() {

    return [[NavController], [NavParams]];
  }
  public username: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams


  ) {

    this.username = this.navParams.get('data');
    console.log(this.username);

  }

  goToMap(){
    this.navCtrl.push(GMapsPage);
    //this.navCtrl.push(MyMapPage);
  }

  goShopping()
  {
    this.navCtrl.push('ShoppingListPage', {
      data: this.username
    }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectStorePage');
  }

}
