import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { saveAs } from 'file-saver';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule, MatTooltipModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  isSidebarVisible=true;

  displayColumns:string[]=['name','category','price','quantity','total','edit']
  dataSource:any=[];
  manageOrderForm:any = FormGroup
  categorys:any=[]
  products:any=[]
  price:any;
  totalAmount:number=0;
  responseMessage:any;

  constructor(private sidebarService:SidebarService,
    private formBuilder:FormBuilder,
    private productService:ProductService,
    private billService:BillService,
    private categoryService:CategoryService,
    private snackbar:SnackbarService,
    private ngx:NgxUiLoaderService
  ){}

  ngOnInit(): void {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
    this.ngx.start()
    this.getCategorys();
    this.manageOrderForm=this.formBuilder.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[null,[Validators.required]]
    })
  }

  getCategorys(){
    this.categoryService.getFilteredCategorys().subscribe((response:any)=>{
      this.ngx.stop()
      this.categorys=response
    },(error:any)=>{
      this.ngx.stop()
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

  getProductByCategory(value:any){
    this.productService.getProductByCategory(value.id).subscribe((response:any)=>{  
      this.products=response
      this.manageOrderForm.controls['price'].setValue('')
      this.manageOrderForm.controls['quantity'].setValue('')
      this.manageOrderForm.controls['total'].setValue(0)
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
      this.price=response.price
      this.manageOrderForm.controls['price'].setValue(response.price)
      this.manageOrderForm.controls['quantity'].setValue(1)
      this.manageOrderForm.controls['total'].setValue(this.price * 1)
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

  setQuantity(value:any){
    var temp=this.manageOrderForm.controls['quantity'].value
    if(temp > 0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    }
    else if(temp != ''){
      this.manageOrderForm.controls['quantity'].setValue('1')
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value)
    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value == 0 || this.manageOrderForm.controls['total'].value == null || this.manageOrderForm.controls['quantity'].value <= 0){
      return true;
    }
    else{
      return false;
    }
  }

  validateSubmit(){
    if(this.totalAmount == 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null){
      return true;
    }
    else{
      return false;
    }
  }

  add(){
    var formData=this.manageOrderForm.value
    var productName=this.dataSource.find((e : {id:number}) => e.id === formData.product.id)
    if(productName === undefined){
      this.totalAmount=this.totalAmount + formData.total
      this.dataSource.push({id:formData.product.id, name:formData.product.name, category:formData.category.name, quantity:formData.quantity, price:formData.price, total:formData.total})
      this.dataSource=[...this.dataSource] 
      this.snackbar.openSnackbar(GlobalConstants.productAdded,'')
    }
    else{
      this.snackbar.openSnackbar(GlobalConstants.productExistError,GlobalConstants.error)
    }
  }

  handleDeleteAction(value:any, element:any){
    this.totalAmount=this.totalAmount - element.total
    this.dataSource.splice(value,1)
    this.dataSource=[...this.dataSource]
  }

  submitAction(){
    var formData=this.manageOrderForm.value
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmount.toString(),
      productDetails:JSON.stringify(this.dataSource)
    }
    console.log("The required Data",data);

    this.ngx.start()
    this.billService.generateReport(data).subscribe((response:any)=>{
      console.log("I am response OK ");
      this.downloadFile(response.uuid)
      this.manageOrderForm.reset()
      this.dataSource=[]
      this.totalAmount=0
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message
        console.log("Error From Server");
      }
      else{
        this.responseMessage=GlobalConstants.genericError
        console.log("Error From Client");
      }
      console.log(error)
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

  downloadFile(fileName:string){
    console.log("Dowenload File Called")
    var data={
      uuid:fileName
    }

    this.billService.getPdf(data).subscribe((response:any)=>{
      saveAs(response,fileName + '.pdf')
      this.ngx.stop()
    })
  }

}
