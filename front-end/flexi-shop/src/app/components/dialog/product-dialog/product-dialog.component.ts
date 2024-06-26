import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatLabel, MatSelectModule, CommonModule, MatInputModule],
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnInit {

  onAddProduct = new EventEmitter()
  onEditProduct = new EventEmitter()
  productForm:any=FormGroup
  dialogAction:any="Add"
  action:any="Add"
  responseMessage:any
  categorys:any=[]

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private productService:ProductService,
    public dialogRef:MatDialogRef<ProductDialogComponent>,
    private categoryService:CategoryService,
    private snackbar:SnackbarService
  ){}

  ngOnInit(): void {
    this.productForm=this.formBuilder.group({
      name:[null,[Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId:[null,[Validators.required]],
      price:[null,[Validators.required]],
      description:[null, Validators.required]
    });

    if(this.dialogData.action === "Edit"){
      this.dialogAction="Edit"
      this.action="Update"
      this.productForm.patchValue(this.dialogData.data)
    }
    this.getCategorys();
  }

  getCategorys(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categorys=response
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  handelSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit()
    }
    else{
      this.add();
    }
  }

  edit(){
    var formData=this.productForm.value
    var data={
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }

    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage=response.message;
      this.snackbar.openSnackbar(this.responseMessage,'');
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  add(){
    var formData=this.productForm.value
    var data={
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }

    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage=response.message;
      this.snackbar.openSnackbar(this.responseMessage,'');
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }



}
