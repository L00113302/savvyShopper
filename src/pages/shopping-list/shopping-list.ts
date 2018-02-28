import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';

/**
 * Generated class for the ShoppngListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  public total:any;
  public quantity:number;
  public price:number;
  public buttonColor: string = '';
  public items : Array<any> =[];
  constructor(public http : HttpClient,  public navCtrl: NavController, public navParams: NavParams) {

  }

 
ionViewWillEnter() : void{
  this.load();

}

  /**
   * retrieve JSON encoded data from remote server
   * using http class and an observable
   * 
   */
load() : void{
  this.http
  //.get('http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/slimapp/public/index.php/api/shoppingList')
  .get('http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/retrieve-dataAWS.php')
  .subscribe((data : any) =>
{
  console.dir(data);
  this.items = data;
},
(error : any) =>{
  console.dir(error);
});
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingListPage');
  }

  //navigate to add item page to view/edit item
  viewEntry(param : any) : void{
    this.navCtrl.push('AddNewItemPage', param);
  }

  addToBasket(items:any)
  {
    //this.quantity = items.ProductQuantity;
    //this.price = items.ProductPrice;
    this.quantity=2;
    this.price=1.99;
    this.total="Total in Your Basket : €"+this.quantity*this.price;
    console.log(this.total);
  }

  goHome(){
    this.navCtrl.push(HomePage); 
  }
}
