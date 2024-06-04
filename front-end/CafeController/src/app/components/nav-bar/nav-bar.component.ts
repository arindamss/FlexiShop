import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink, CommonModule, MatDialogModule, HttpClientModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(private dialog:MatDialog, 
      private router:Router,
      private loginService:LoginService){}

  

  openDialog(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.width = '550px'
    this.dialog.open(SignupComponent, dialogConfig)
  }

  forgotPasswordDialog(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.width = '550px'
    this.dialog.open(ForgotPasswordComponent, dialogConfig)
  }

  loginDialog(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.width = '550px'
    this.dialog.open(LoginComponent, dialogConfig)
  }
  

}
