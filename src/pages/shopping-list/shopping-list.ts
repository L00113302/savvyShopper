import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CurrencyPipe } from '@angular/common';
import { isTrueProperty } from 'ionic-angular/util/util';
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
  //public isChecked:boolean;
  public disabled:boolean;
  public itemTotal:any;
  public basketTotal:number=0.00;
  public grandTotal:any;
  public myColour:String="#000066";
  public quantity:number;
  public price:number;
  public buttonColor: string = 'rgba(0,0,0,0.0)';
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


  checked : boolean;

  datachanged(e:any,item){
    
    if(e.checked==true)
    {
     //window.localStorage.setItem(e.checked, true);
     //for(var i=0;i<item.length();i++){
      this.quantity=item.ProductQuantity;
      this.price=item.ProductPrice;
      this.itemTotal=this.quantity*this.price;
      this.basketTotal=this.itemTotal+this.basketTotal;
      this.grandTotal=this.getCurrency(this.basketTotal);
      console.log(item);
      console.log(this.quantity);
      console.log(this.price);
     }
      
  
   
    if(e.checked==false)
    {
      //window.localStorage.setItem(e.checked, "false");
      this.quantity=item.ProductQuantity;
      this.price=item.ProductPrice;
      this.itemTotal=this.quantity*this.price;
      this.basketTotal=this.basketTotal-this.itemTotal;
      this.grandTotal=this.getCurrency(this.basketTotal);
      console.log(item);
    }
 
  
}
  
  resetList()
  {
    
    this.itemTotal=0;
    this.basketTotal=0;
    this.grandTotal=this.getCurrency(0.00);
    this.checked=false;
    //this.disabled=false;
  }

  goHome(){
    this.navCtrl.push(HomePage); 
  }
}
