import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShoppingListPage } from '../shopping-list/shopping-list';
//import { AndroidPermissions } from ‘@ionic-native/android-permissions’;


@IonicPage()
@Component({
    selector: 'page-add-new-item',
    templateUrl: 'add-new-item.html'
})
export class AddNewItemPage {



    // Define FormGroup property for managing form validation / data retrieval
    public form: FormGroup;

    //Model for managing fields
    // public custID         : any;
    public productName: any;
    public productQuantity: any;
    public productPrice: any;
    public bCode: any;
    public uName: string;
    //public dataChecked:string="False";

    // Flag to be used for checking whether we are adding/editing an entry
    public isEdited: boolean = false;

    //Flag to hide the form upon successful completion of remote operation
    public hideForm: boolean = false;

    //Property to help set the page title
    public pageTitle: string;


    //Property to store the recordID for when an existing entry is being edited
    public recordID: any = null;

    //Remote URI for retrieving data from and sending data to
    private baseURI: string = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/";
    //private URL : String = "http://ec2-34-244-210-200.eu-west-1.compute.amazonaws.com/slimapp/public/index.php/api/shoppingListEntry";
    //private baseURI2   : string = "http://127.0.0.1/";

    options: BarcodeScannerOptions;
    results: {};

    // result of barcode scan
    //public products : Array<any> =[];
    public products: any[] = [];
    public selectedProduct: any;
    public productFound: boolean = false;

    // Initialise module classes
    constructor(private barcodeScanner: BarcodeScanner,
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: HttpClient,
        public NP: NavParams,
        public fb: FormBuilder,
       // public androidPermissions: AndroidPermissions,
        public toastCtrl: ToastController) {

            this.uName = this.navParams.get('data');
            console.log(this.uName);
            console.log(this.navParams.data)

        // Create form builder validation rules
        this.form = fb.group({
            "ProductName": ["", Validators.required],
            "ProductQuantity": ['', Validators.compose([Validators.required,
            Validators.pattern('[1,2,3,4,5,6,7,8,9,10,11]'), Validators.minLength(1), Validators.maxLength(8)])],
            "ProductPrice": ['', Validators.compose([Validators.required,
            Validators.minLength(1), Validators.maxLength(8)])]
        });
    }




    /**
     * Triggered when template view is about to be entered
     * Determine whether we adding or editing a record
     * based on any supplied navigation parameters
     */
    ionViewWillEnter(): void {
        this.resetFields();
        //this.loadProducts();
        if (this.NP.get("record")) {
            this.isEdited = true;
            this.selectEntry(this.NP.get("record"));
            this.pageTitle = 'Amend entry';
        }
        else {
            this.isEdited = false;
            this.pageTitle = 'Create Entry';
        }
    }




    /**
     * Assign the navigation retrieved data to properties
     * used as models on the page's HTML form
     *
     */
    selectEntry(item: any): void {
        this.recordID = item.CustomerID;
        this.productName = item.ProductName;
        this.productQuantity = item.ProductQuantity;
        this.productPrice = item.ProductPrice;
        this.uName = item.uName;
    }

    addItem(item: any): void {
        // this.recordID = item.CustomerID;
        this.productName = item.ProductName;
        this.productQuantity = 1;
        this.productPrice = item.ProductPrice;
        //this.dataChecked = this.dataChecked;
        //this.uName=this.uName;
    
    }





    /**
     * Save a new record that has been added to the page's HTML form
     * Use angular's http post method to submit the record data
     *
     */
    createEntry(ProductName: string, ProductQuantity: number, ProductPrice: number, uName): void {
        let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { "key": "create", "ProductName": ProductName, "ProductQuantity": ProductQuantity, "ProductPrice": ProductPrice, "uName": uName },
            url: any = this.baseURI + "manage-dataAWS.php";
        // url       : any      	= this.URL + "/add";

        this.http.post(url, JSON.stringify(options), headers)
            .subscribe((data: any) => {
                // If the request was successful notify the user
                this.hideForm = true;
                this.sendNotification(`${ProductName} was added`);
                this.navCtrl.push('ShoppingListPage', {
                    data: this.uName
                  }); 
            },
                (error: any) => {
                    console.dir(error);
                    this.sendNotification('Something went wrong!');
                });
    }




    /**
     * Update an existing record that has been edited in the page's HTML form
     * Use angular's http post method to submit the record data
     * to our remote PHP script
     *
     */
    updateEntry(ProductName: string, ProductQuantity: number, ProductPrice: number, dataChecked: string, uName:string): void {
        let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { "key": "update", "ProductName": ProductName, "ProductQuantity": ProductQuantity, "ProductPrice": ProductPrice, "dataChecked": dataChecked, "recordID": this.recordID },
            url: any = this.baseURI + "manage-dataAWS.php";

        this.http
            .post(url, JSON.stringify(options), headers)
            .subscribe(data => {
                // If the request was successful notify the user
                this.hideForm = true;
                console.log(this.uName);
                this.sendNotification(`${ProductName} was updated`);
                //this.navCtrl.pop();
                this.navCtrl.push('ShoppingListPage', {
                    data: uName
                  });
            },
                (error: any) => {
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
    deleteEntry(): void {
        let name: string = this.form.controls["ProductName"].value,
            headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { "key": "delete", "recordID": this.recordID },
            url: any = this.baseURI + "manage-dataAWS.php";

        this.http
            .post(url, JSON.stringify(options), headers)
            .subscribe(data => {
                this.hideForm = true;
                this.sendNotification(`${name} was deleted`);
                this.navCtrl.push('ShoppingListPage', {
                    data: this.uName
                  });
            },
                (error: any) => {
                    this.sendNotification('Something went wrong!');
                });
    }




    /**
     * Handle data submitted from the page's HTML form
     * Determine whether we are adding a new record or amending an
     * existing record
     */
    saveEntry(): void {
        let
            prodName: string = this.form.controls["ProductName"].value,
            prodQuantity: number = this.form.controls["ProductQuantity"].value,
            prodPrice: number = this.form.controls["ProductPrice"].value,
            dataChecked: string = "False",
            uName: string = this.uName;

        if (this.isEdited) {
            this.updateEntry(prodName, prodQuantity, prodPrice, dataChecked, uName);
        }
        else {
            this.createEntry(prodName, prodQuantity, prodPrice, this.uName);
        }
    }




    /**
     * Clear values in the page's HTML form fields
     *
     */
    resetFields(): void {
        //this.custID           = "";
        this.productName = "";
        this.productQuantity = " ";
        this.productPrice = " ";
    }




    /**
     * Manage notifying the user of the outcome of remote operations
     *
     */
    sendNotification(message: string): void {
        let notification = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        notification.present();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ShoppingListPage');
    }



    // get product from barcode after scanning 
    getData(bCode) {

        let
            url: any = this.baseURI + "retrieve-productsAWS.php";
        this.http.get(url)
            .subscribe((data: any) => {
                this.selectedProduct = {};
                // If the request was successful notify the user
                this.products = data;
                this.productFound = true;
                this.sendNotification(`Product Found`);
                this.selectedProduct = this.products.find(products => products.BarcodeNo === bCode);
                console.log(this.selectedProduct);
                this.addItem(this.selectedProduct);
            },
                (error: any) => {
                    console.log(bCode);
                    console.log(error);
                    this.sendNotification('Something went wrong!');
                });
    }


    scan() {
        //this.selectedProduct={};
        this.barcodeScanner.scan().then((barcodeData) => {
            this.selectedProduct = this.getData(barcodeData.text);
        }, (err) => {
            console.dir(err);
        })
    }
}
