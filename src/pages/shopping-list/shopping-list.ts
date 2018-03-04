import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CurrencyPipe } from '@angular/common';
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

  public itemTotal:any;
  public basketTotal:number=0.00;
  public grandTotal:any;
  
  public quantity:number;
  public price:number;
  public buttonColor: string = '';
  public items : Array<any> =[];
  constructor(public http : HttpClient,  public navCtrl: NavController, public navParams: NavParams, private currencyPipe: CurrencyPipe) {
   // let amount = 1337.1337;
    //console.log(this.getCurrency(amount));
  }
  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'EUR', "symbol", '1.2-2');
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

  addToBasket(item)
  {
   // this.isChecked=true;
    this.quantity=item.ProductQuantity;
    this.price=item.ProductPrice;
    this.itemTotal=this.quantity*this.price;
    this.addToTotal(this.itemTotal);
    
    //console.log(this.itemTotal);
    
    //console.log(this.quantity);
    //console.log(this.price);
  }

  

  addToTotal(itemT){
    this.basketTotal=itemT+this.basketTotal;
    this.grandTotal=this.getCurrency(this.basketTotal);
    //console.log(this.basketTotal);
    //this.basketTotal="Total in Your Basket : €"+this.basketTotal;
  }
  public isChecked:boolean;
  resetList()
  {
    
    this.itemTotal=0;
    this.basketTotal=0;
    this.grandTotal=this.getCurrency(0.00);
    this.isChecked=false;
  }

  goHome(){
    this.navCtrl.push(HomePage); 
  }
}
