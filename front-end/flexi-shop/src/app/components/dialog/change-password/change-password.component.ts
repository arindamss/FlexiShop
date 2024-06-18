import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MatToolbarModule, ReactiveFormsModule,HttpClientModule, CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  oldPassword=true;
  newPassword=true;
  confirmPassword=true;
  changePasswordForm:any=FormGroup
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ChangePasswordComponent>,
    private ngx:NgxUiLoaderService,
    private snackbar:SnackbarService
  ){}
  
  ngOnInit(): void {
    this.changePasswordForm=this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null, [Validators.required]],
      confirmPassword:[null, [Validators.required]]
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }
    else{
      return false;
    }
  }

  handlePasswordChangeSubmite(){
    this.ngx.start();
    var formData=this.changePasswordForm.value;
    var data={
      oldPassword:formData.oldPassword,
      newPassword:formData.newPassword,
      confirmPassword:formData.confirmPassword
    }

    this.userService.changePassword(data).subscribe((response:any)=>{
      this.ngx.stop();
      this.responseMessage=response?.message;
      this.dialogRef.close();
      this.snackbar.openSnackbar(this.responseMessage,'');
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      // this.dialogRef.close();
      this.snackbar.openSnackbar(this.responseMessage,'error');
    })
  }



}
