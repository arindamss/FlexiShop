import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { HeaderComponent } from '../layout/header/header.component';
import { SidenavComponent } from '../layout/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { DashbordComponent } from '../dashbord/dashbord.component';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
// All the material module
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoginService } from '../../services/login.service';
import { CategoryComponent } from '../category/category.component';
import { ManageProductComponent } from '../manage-product/manage-product.component';


const ngxUiLoaderConfig : NgxUiLoaderConfig={
  text:"loading...",
  textColor:"#FFFFFF",
  textPosition:'center-center',
  bgsColor:"#7b1f2a",
  fgsColor:"#7b1f2a",
  fgsType:SPINNER.pulse,
  fgsSize:100,
  hasProgressBar:false

}


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, SidenavComponent,NavBarComponent, DashbordComponent, RouterModule, CommonModule, RouterModule, NgxUiLoaderModule, CategoryComponent, ManageProductComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  isSidebarVisible = true;
  constructor(private sidebarService: SidebarService, private loginService:LoginService) {}


  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  checkLogin(){
    return this.loginService.isLogined();
    // this.loginService.checkToken().subscribe((response)=>{
    //   return true;
    // },(error)=>{
    //   return false;
    // })
  }



}
