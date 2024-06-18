import { Component, Inject, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule ,MatToolbarModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  password=true
  confirmPassword=true;
  signupForm:any=FormGroup
  responseMessage:any;
  // userService=Inject(UserService)
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.signupForm=this.formBuilder.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]]
    })
  }

  validateSubmit(){
    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }
    else{
      return false;
    }
  }


  handelSubmit(){
    this.ngxService.start();
    var formData=this.signupForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      password:formData.password
    }

    this.userService.signup(data).subscribe((response:any) =>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage=response?.message;
      this.snackBarService.openSnackbar(this.responseMessage,"")
      this.router.navigate(['/']);
    },(error:any) =>{
      this.ngxService.stop();
      if(error.error?.message){
        console.log("I am not called");
        this.responseMessage=error.error?.message;
      }
      else{
        console.log("I am called");
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackBarService.openSnackbar(this.responseMessage, GlobalConstants.error)
    }
   )

  }



}
