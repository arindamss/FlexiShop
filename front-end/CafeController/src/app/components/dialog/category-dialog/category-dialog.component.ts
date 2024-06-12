import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatToolbarModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css'
})
export class CategoryDialogComponent implements OnInit {
  
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm:any = FormGroup
  dialogAction:any = "Add"
  action:any = "Add"
  categoryId:any;

  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
    private formBuilder:FormBuilder,
    private categoryService:CategoryService,
    public dialogRef:MatDialogRef<CategoryDialogComponent>,
    private snackbar:SnackbarService
  ){}
  
  ngOnInit(): void {
    this.categoryForm=this.formBuilder.group({
      name:[null,[Validators.required]]
    });

    if(this.dialogData.action === "Edit"){
      this.categoryId=this.dialogData.data.id;
      this.dialogAction="Edit";
      this.action="update"
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handelSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData=this.categoryForm.value;
    var data={
      name:formData.name
    }

    this.categoryService.addCategory(data).subscribe((response:any)=>{
      this.dialogRef.close()
      this.onAddCategory.emit();
      this.responseMessage=response.message
      this.snackbar.openSnackbar(this.responseMessage,'')
    },(error)=>{
      this.dialogRef.close();
      // console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    });
  }

  edit(){
    var formData=this.categoryForm.value;
    var data={
      id:this.categoryId,
      name:formData.name
    }
    console.log(" I am pring Data",data);
    

    this.categoryService.updateCategory(data).subscribe((response:any)=>{
      this.dialogRef.close()
      this.onAddCategory.emit();
      this.responseMessage=response.message
      this.snackbar.openSnackbar(this.responseMessage,'')
    },(error)=>{
      this.dialogRef.close();
      // console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

}
