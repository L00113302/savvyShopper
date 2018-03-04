import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomePage } from '../home/home';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {
 
  // Define FormGroup property for managing form validation / data retrieval
  public form : FormGroup;

  //Model for managing fields
   public uName : any;
   public pWord : any;
   public fName : any;
   public eMail : any;

   // Flag to be used for checking whether we are adding/editing an entry
   public isEdited               : boolean = false;

  //Flag to hide the form upon successful completion of remote operation
  public hideForm               : boolean = false;


  // xampp url testing on local host
  //private baseURI   : string = "http://127.0.0.1/";

  // AWS url
  private baseURI               : string  = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/";


  // Initialise module classes
  constructor(
              public navCtrl    : NavController,
              public http       : HttpClient,
              public NP         : NavParams,
              public fb         : FormBuilder,
              public toastCtrl  : ToastController)


  {

    // Create form builder validation rules
    this.form = fb.group({
        username: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9_]{8,12}'), Validators.minLength(8), Validators.maxLength(30)])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        name                 : ["", Validators.required],
        email           : ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+[a-zA-Z0-9._-]')])]
    });
     
  }



  /**
   * Handle data submitted from the page's HTML form
   * Determine whether we are adding a new record or amending an
   * existing record
   */
  saveUser() : void
  {
     let
         uName   : string    = this.form.controls["username"].value,
         pWord   : string    = this.form.controls["password"].value,
         fName          : string = this.form.controls["name"].value,
         eMail   : string    = this.form.controls["email"].value;

     this.createUser(uName, pWord, fName, eMail );
  }


  /**
   * create new user
   *
   */
  createUser(username : string, password : string, name: string, email: string) : void
  {

   /* let
    uName   : string    = this.form.controls["username"].value,
    pWord   : string    = this.form.controls["password"].value,
    fName   : string    = this.form.controls["name"].value,
    eMail   : string    = this.form.controls["email"].value;*/

     let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
         options 	: any		= { "key" : "addUser", "username" : username, "password" : password, "name" : name, "email" : email },
         url       : any      	= this.baseURI + "manage-dataAWS.php";
        

     this.http.post(url, JSON.stringify(options), headers)
     .subscribe((data : any) =>
     {
        // If the request was successful notify the user
        this.hideForm   = true;
        this.sendNotification(`${username} was successfully added, please sign in`);
        this.navCtrl.push(HomePage); 
     },
     (error : any) =>
     {
       //console.log(username);
       //console.log(error);
       // send notification if user exists
        this.sendNotification('username or email already exists!');
     });
  }



  /**
   * Clear values in the page's HTML form fields
   *
   */
  resetFields() : void
  {
     this.uName    = "";
     this.pWord    = "";
     this.fName    = ""; 
     this.eMail    = "";
  }



  /**
   * Manage notifying the user of the outcome of remote operations
   *
   */
  sendNotification(message : string)  : void
  {
     let notification = this.toastCtrl.create({
         message       : message,
         duration      : 4000
     });
     notification.present();
  }
 
 }


