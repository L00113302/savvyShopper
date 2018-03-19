import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CurrencyPipe } from '@angular/common';
import { isTrueProperty } from 'ionic-angular/util/util';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SelectStorePage } from '../select-store/select-store';
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
  total: any;
  public isDisabled:string="True";
  public dataChecked: string;
  public checked: string;
  public disabled: boolean;
  public itemTotal: any;
  public basketTotal: number = 0.00;
  public grandTotal: any;
  public myColour: String = "#000066";
  public quantity: number;
  public price: number;
  public buttonColor: string = 'rgba(0,0,0,0.0)';
  public items: Array<any> = [];
  public username: any;
  public selectedProducts: any;
  private baseURI1: string = "http://127.0.0.1"
  private baseURI2: string = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com";



  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private currencyPipe: CurrencyPipe,
    public storage: Storage
  ) {
    this.username = this.navParams.get('data');
    console.log(this.username);
    //this.load();
    this.loadData();
  }

  // change double to euros currency
  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'EUR', "symbol", '1.2-2');
  }

 
  addItem(){
    this.navCtrl.push('AddNewItemPage', {
      data: this.username
    }); 
  } 

  ionViewWillEnter(): void {
    //this.load();

  }
  // get users shopping list 
  loadData() {

    let
      headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any = { "key": "readData", "uName": this.username },
      url: any = this.baseURI2 + "/manage-dataAWS.php";

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {

        console.dir(data);
        this.items = data;

      },
        (error: any) => {
          console.log('Something went wrong!');
        });
  }



  //navigate to add item page to view/edit item
  viewEntry(param: any): void {
    this.navCtrl.push('AddNewItemPage', param);
  /* this.navCtrl.push('AddNewItemPage', {
      data: this.username
    }); */
    
  }

  // clear checkbox when item edited
  public checkChanged(e: any, item) {
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any = { "key": "updateCheckfields", "ProductName": item.ProductName, "dataChecked": JSON.stringify(e.checked) },
      url: any = this.baseURI2 + "/manage-dataAWS.php";

    this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
        console.log("success");
      },
        (error: any) => {
          console.log(error);
        });
  }

  // calculate total on check or uncheck
  datachanged(e: any, item) {

    if (e.checked == true) {
      this.quantity = item.ProductQuantity;
      this.price = item.ProductPrice;
      this.itemTotal = this.quantity * this.price;
      this.basketTotal = this.itemTotal + this.basketTotal;
      this.grandTotal = this.getCurrency(this.basketTotal);
    }

    if (e.checked == false) {
      //window.localStorage.setItem(e.checked, "false");
      this.quantity = item.ProductQuantity;
      this.price = item.ProductPrice;
      this.itemTotal = this.quantity * this.price;
      this.basketTotal = this.basketTotal - this.itemTotal;
      this.grandTotal = this.getCurrency(this.basketTotal);
    }
  }

  // clear checkfields on database
  clearCheckfields(): void {
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any = { "key": "clearCheckfields" },
      url: any = this.baseURI2 + "/manage-dataAWS.php";

    this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data: any) => {
        console.log("success");
        this.loadData();
      },
        (error: any) => {
          console.log("fail");
          console.log(error);
        });
  }

  // reset values and checkfields
  resetList() {
    this.itemTotal = 0;
    this.basketTotal = 0;
    this.grandTotal = this.getCurrency(0.00);
    this.clearCheckfields();
  }

  goToSsP()
  {
    this.navCtrl.push(SelectStorePage); 
  }

  // back to login
  goHome() {
    this.resetList();
    this.navCtrl.push(HomePage);
  }
}
