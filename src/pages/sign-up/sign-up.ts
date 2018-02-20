import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
//import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  public form                   : FormGroup;

  //Model for managing fields
   public uName         : any;
   public pWord         : any;
   public fName  : any;
   public eMail        : any;

   // Flag to be used for checking whether we are adding/editing an entry
   public isEdited               : boolean = false;

  //Flag to hide the form upon successful completion of remote operation
  public hideForm               : boolean = false;

  //Property to help set the page title
  public pageTitle              : string;


  //Property to store the recordID for when an existing entry is being edited
  public recordID               : any      = null;

  //Remote URI for retrieving data from and sending data to
  //private baseURI               : string  = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/";
  //private URL : String = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/slimapp/public/index.php/api/shoppingListEntry";
  private baseURI   : string = "http://127.0.0.1/";



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
        "username"                  : ["", Validators.required],
        "password"           : ["", Validators.required],
        "name"                  : ["", Validators.required],
        "email"           : ["", Validators.required]
     });
  }




  /**
   * Triggered when template view is about to be entered
   * Determine whether we adding or editing a record
   * based on any supplied navigation parameters
   */
  ionViewWillEnter() : void
  {
     this.resetFields();

     if(this.NP.get("record"))
     {
        this.isEdited      = true;
        this.selectEntry(this.NP.get("record"));
        this.pageTitle     = 'Amend entry';
     }
     else
     {
        this.isEdited      = false;
        this.pageTitle     = 'Create Entry';
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
   * Save a new record that has been added to the page's HTML form
   * Use angular's http post method to submit the record data
   *
   */
  createEntry(username : string, password : string, name: string, email: string) : void
  {
     let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
         options 	: any		= { "key" : "addUser", "username" : username, "password" : password, "name" : name, "email" : email },
         url       : any      	= this.baseURI + "manage-dataAWS.php";
        // url       : any      	= this.URL + "/add";

     this.http.post(url, JSON.stringify(options), headers)
     .subscribe((data : any) =>
     {
        // If the request was successful notify the user
        this.hideForm   = true;
        this.sendNotification(`Congratulations the user: ${username} was successfully added`);
     },
     (error : any) =>
     {
       console.log(username);
       console.log(error);
        this.sendNotification('Something went wrong!');
     });
  }




  /**
   * Update an existing record that has been edited in the page's HTML form
   * Use angular's http post method to submit the record data
   * to our remote PHP script
   *
   */
  updateEntry(username : string, password : string, name: string, email: string) : void
  {
     let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
         options 	: any		= { "key" : "update", "username" : username, "password" : password, "email" : email, "recordID" : this.recordID},
         url       : any      	= this.baseURI + "manage-dataAWS.php";

     this.http
     .post(url, JSON.stringify(options), headers)
     .subscribe(data =>
     {
        // If the request was successful notify the user
        this.hideForm  =  true;
        this.sendNotification(`Congratulations the technology: ${name} was successfully updated`);
     },
     (error : any) =>
     {
         console.log(error);
        this.sendNotification('Something went wrong!');
     });
  }




  /**
   * Remove an existing record that has been selected in the page's HTML form
   * Use angular's http post method to submit the record data
   * to our remote PHP script
   *
   */
  deleteEntry() : void
  {
     let name      : string 	= this.form.controls["username"].value,
         headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
         options 	: any		= { "key" : "delete", "recordID" : this.recordID},
         url       : any      	= this.baseURI + "manage-dataAWS.php";

     this.http
     .post(url, JSON.stringify(options), headers)
     .subscribe(data =>
     {
        this.hideForm     = true;
        this.sendNotification(`Congratulations the user: ${name} was successfully deleted`);
     },
     (error : any) =>
     {
        this.sendNotification('Something went wrong!');
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

     if(this.isEdited)
     {
        this.updateEntry(uName, pWord, fName, eMail );
     }
     else
     {
        this.createEntry(uName, pWord, fName, eMail );
     }
  }




  /**
   * Clear values in the page's HTML form fields
   *
   */
  resetFields() : void
  {
     this.uName           = "";
     this.pWord    = "";
     this.fName           = "";
     this.eMail   = "";
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
 /* options: BarcodeScannerOptions;
  results: {};


  async scanBarcode(){
      this.results = await this.barcode.scan();
      console.log(this.results);
     }/*/
 }



