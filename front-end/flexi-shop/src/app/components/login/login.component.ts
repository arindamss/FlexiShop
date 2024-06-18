import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatFormField, MatInputModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hide=true
  loginForm:any=FormGroup
  responseMessage:any;

  constructor(private loginService:LoginService,
    public dialog:MatDialogRef<LoginComponent>,
    private ngx:NgxUiLoaderService,
    private router:Router,
    private formBuilder:FormBuilder,
    private snackBar:SnackbarService
  ){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]]
    })
  }

  handelSubmit(){
    this.ngx.start();
    var formData=this.loginForm.value
    var data={
      email:formData.username,
      password:formData.password
    }

    this.loginService.login(data).subscribe((response:any)=>{
      this.ngx.stop();
      this.dialog.close();
      localStorage.setItem('token',response.token);
      this.responseMessage=response?.message;
      this.snackBar.openSnackbar(this.responseMessage,'');
      this.router.navigate(['/shop/dashbord']);
    },(error:any)=>{
      if(error.error?.message){
        this.ngx.stop();
        console.log("Error from Server");
        this.responseMessage=error.error?.message;
      }
      else{
        this.ngx.stop();
        console.log("Error from Client");
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackBar.openSnackbar(this.responseMessage,GlobalConstants.error);
    })
  }


}
