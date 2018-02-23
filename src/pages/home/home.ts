import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ShoppingListPage } from '../shopping-list/shopping-list';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { SelectStorePage } from '../select-store/select-store';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Http, Headers } from '@angular/http';
/*
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage { 

  responseData : any;
  userData = {"username": "","password": ""};

   // Define FormGroup property for managing form validation / data retrieval
   public authForm                  : FormGroup;
   private baseURI               : string  = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/";
   //private baseURI   : string = "http://127.0.0.1/";
   //Model for managing fields
   // public custID         : any;
    public username         : any;
    public password  : any;
    //public prodPrice        : any;

    // Flag to be used for checking whether we are adding/editing an entry
    public isEdited               : boolean = false;

   //Flag to hide the form upon successful completion of remote operation
   public hideForm               : boolean = false;

   //Property to help set the page title
   public pageTitle              : string;


   //Property to store the recordID for when an existing entry is being edited
   public recordID               : any      = null;
 // username: AbstractControl;
  //password: AbstractControl;  
  public buttonColor: string = '';
  public items : Array<any> =[];

  
  
  
  constructor(public http : HttpClient, public Http: Http,  public navCtrl: NavController, public navParams: NavParams, 
    public fb : FormBuilder, 
    public toastCtrl : ToastController,
    public authService:AuthServiceProvider
  ) {

    this.authForm = fb.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(8), Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
  });

  }
  onSubmit(value: any): void { 
    if(this.authForm.valid) {
        window.localStorage.setItem('username', value.username);
       window.localStorage.setItem('password', value.password);
    
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= {"username" : value.username, "password" : value.password},
        url       : any      	= this.baseURI + "SlimRestful/api/login";
       //url       : any      	= this.baseURI + "manage-dataAWS.php";

   this.http.post(url, JSON.stringify(options), headers)
   .subscribe((data : any) =>
   {
      // If the request was successful notify the user
      this.hideForm   = true;
      this.sendNotification(`Congratulations the user: ${value.username} was successfully verified`);
      this.navCtrl.push('SelectStorePage'); 
   },
   (error : any) =>
   {
     console.log(value.username);
     console.log(error);
     this.sendNotification('Something went wrong!');
   });
  }
}

  resetFields() : void
  {
     //this.custID           = "";
     this.username    = "";
     this.password           = "";
  }




  /**
   * Manage notifying the user of the outcome of remote operations
   *
   */
  sendNotification(message : string)  : void
  {
     let notification = this.toastCtrl.create({
         message       : message,
         duration      : 3000
     });
     notification.present();
    }

  ionViewWillEnter() : void{
   // this.load();
    this.username = this.authForm.controls['username'];     
    this.password = this.authForm.controls['password']; 
  }
  selectEntry(item : any) : void
   {
      this.recordID        = item.user_id;
      this.username = item.username;
      this.password              = item.password;
   }

    /**
     * retrieve JSON encoded data from remote server
     * using http class and an observable
     * 
     */
  /*load() : void{
    this.http
    //.get('http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/slimapp/public/index.php/api/shoppingList')
    .get('http://localhost/retrieve-users.php')
    .subscribe((data : any) =>
  {
    console.dir(data);
    this.items = data;
  },
  (error : any) =>{
    console.dir(error);
  });
  }/*/
    ionViewDidLoad() {
      console.log('ionViewDidLoad HomePage');
    }
  
    //navigate to add item page to view/edit item
    viewEntry(param : any) : void{
      this.navCtrl.push('AddNewItemPage', param);
    }
  
    validUser()
    {
      //if(this.uName)
    }

   /* login(){
      this.authService.postData(this.userData).then((result) => {
       this.responseData = result;
       if(this.responseData.userData){
       console.log(this.responseData);
       localStorage.setItem('userData', JSON.stringify(this.responseData));
       this.navCtrl.push(SelectStorePage);
       }
       else{ 
         console.log("Invalid User");
        console.log(result);
        console.log(this.userData);
        }
     }, (err) => {
       console.dir(err);
       // Error log
     });
  
    }*/
  
  }