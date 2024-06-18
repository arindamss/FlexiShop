import { Component, OnInit } from '@angular/core';
import { DashbordService } from '../../services/dashbord.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import {MatCardModule} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-dashbord',
  standalone: true,
  imports: [RouterLink, MatCardModule, CommonModule],
  templateUrl: './login-dashbord.component.html',
  styleUrl: './login-dashbord.component.css'
})
export class LoginDashbordComponent implements OnInit {

  isSidebarVisible=true;

  responseMessage:any;
  data:any;

  constructor(private sidebarService:SidebarService,
    private dashbordService:DashbordService,
    private ngxService:NgxUiLoaderService,
    private snackbar:SnackbarService
  ){
    this.ngxService.start();
    this.displayData();
  }

  ngOnInit(){
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  displayData(){
    this.dashbordService.getDetails().subscribe((response:any)=>{
      this.ngxService.stop();
      this.data=response;
    },(error:any) =>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error); 
    })
  }

}
