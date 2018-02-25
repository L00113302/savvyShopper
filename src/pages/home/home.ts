import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

   // Define FormGroup property for managing form validation / data retrieval
   public authForm                  : FormGroup;

    //Model for managing fields
    public uName         : any;
    public pWord         : any;
    public fName         : any;
    public eMail        : any;

     //Property to store the recordID for when an existing entry is being edited
  public recordID               : any      = null;
   private baseURI               : string  = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/";
   //private baseURI   : string = "http://127.0.0.1/";


    // Flag to be used for checking whether we are adding/editing an entry
    public isEdited               : boolean = false;

   //Flag to hide the form upon successful completion of remote operation
   public hideForm               : boolean = false;
   public buttonColor: string = '';
   public items : Array<any> =[];

  
  
  
  constructor(public http : HttpClient, public Http: Http,  public navCtrl: NavController, public navParams: NavParams, 
    public fb : FormBuilder, 
    public toastCtrl : ToastController,
    public authService:AuthServiceProvider
  ) {
    // validators for username and password fields
    this.authForm = fb.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9_]{8,30}'), Validators.minLength(8), Validators.maxLength(12)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(12)])]
  });

<<<<<<< HEAD
  }
  onSubmit(value: any): void { 
    if(this.authForm.valid) {
        window.localStorage.setItem('username', value.username);
       window.localStorage.setItem('password', value.password);
    
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= {"key":"validateUser", "username" : value.username, "password" : value.password},
        //url       : any      	= this.baseURI + "SlimRestful/api/login";
       url       : any      	= this.baseURI + "manage-dataAWS.php";

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
=======
>>>>>>> login-working
}

   /**
   * Triggered when template view is about to be entered
   * Determine whether we adding or editing a record
   * based on any supplied navigation parameters
   */
  ionViewWillEnter() : void
  {
     this.resetFields();

     if(this.navParams.get("record"))
     {
        this.isEdited      = true;
        this.selectEntry(this.navParams.get("record"));
     }
     else
     {
        this.isEdited      = false;
     }
  }

  /**
   * Assign the navigation retrieved data to properties
   * used as models on the page's HTML form
   *
   */
  selectEntry(item : any) : void
  {
     this.recordID        = item.user_id;
     this.uName = item.username;
     this.pWord              = item.password;
     this.fName      = item.name;
     this.eMail = item.email;
  }

  /**
   * Clear values in the page's HTML form fields
   *
   */
  resetFields() : void
  {
     this.uName           = "";
     this.pWord    = "";
    
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

  // verify credentials for login
  logInUser(username, password){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
    options 	: any		= { "key" : "validateUser", "username" : username, "password" : password},
    url       : any      	= this.baseURI + "manage-dataAWS.php";
  
  this.http
  .post(url, JSON.stringify(options), headers)
  .subscribe(data =>
  {
   // If the request was successful notify the user
   // and open select store page
   this.hideForm  =  true;
   this.sendNotification(`Welcome ${username} !`);
   this.navCtrl.push(SelectStorePage);
   this.resetFields();
  },
  (error : any) =>
  {
   // console.log(error);
    //console.log(username);
    //console.log(password);
   this.sendNotification('Wrong Username or Password!');
   this.resetFields();
  });
  }
  
  // if all fields are valid call login method
  onSubmit(value: any): void { 
    if(this.authForm.valid) {
       // window.localStorage.setItem('username', value.username);
       //window.localStorage.setItem('password', value.password);
       let
       uName   : string    = this.authForm.controls["username"].value,
       pWord   : string    = this.authForm.controls["password"].value;
      // call loginuser method
      this.logInUser(uName, pWord );
  
   }
    
  }
}



  