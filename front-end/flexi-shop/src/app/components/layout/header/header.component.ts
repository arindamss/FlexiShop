import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarService } from '../../../services/sidebar.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from '../../dialog/change-password/change-password.component';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatDialogModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  role:any;

  constructor(private sidebarService: SidebarService,
    private router:Router,
    private dialog:MatDialog
  ) {}

  toggleSidebar() {
  // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    console.log("I am clicked");
  }

  logout(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.width="400px"
    dialogConfig.data={
      message:"Logout",
      confirmation:true
    };
    const dialogRef=this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub=dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })

  }

  changePassword(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.width="550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}
