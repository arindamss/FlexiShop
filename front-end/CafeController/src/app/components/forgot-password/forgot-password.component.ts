import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../shared/global-constants';
import { Router } from '@angular/router';

import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatToolbar, MatToolbarRow, MatButtonModule, MatDialogModule, MatIconModule,MatInputModule , ReactiveFormsModule, MatFormFieldModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : any=FormGroup
  responseMessage:any;

  constructor(private userService:UserService,
    private formBuilder:FormBuilder,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbar:SnackbarService,
    private router:Router
  ) {}

  ngOnInit(){
    this.forgotPasswordForm=this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

  handelForgotPassword(){
    this.ngxService.start();
    var formData=this.forgotPasswordForm.value;
    var data={
      username:formData.email
    }

    this.userService.forgotPassword(data).subscribe((response:any) =>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage=response?.message
      this.snackbar.openSnackbar(this.responseMessage,'')
      console.log("Email Send")
      this.router.navigate(['/'])
    },(error:any) =>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
        console.log("Error from Server");
      }
      else{
        console.log("Error from client");
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error);
    }
    )

  }

}
