import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInput, MatTableModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent implements OnInit {

  isSidebarVisible=true;

  displayedColumns:string[]=['name','email','contactNumber','status']
  dataSource:any;
  responseMessage:any;

  constructor(private sidebarService:SidebarService,
    private ngx:NgxUiLoaderService,
    private userService:UserService,
    private snackbar:SnackbarService
  ){}

  ngOnInit(): void {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
    this.ngx.start();
    this.tableData();
  }

  tableData(){
    this.userService.getUser().subscribe((response:any)=>{
      this.ngx.stop()
      this.dataSource=new MatTableDataSource(response)
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

  applyFilter(event:Event){
    var filterValue=(event.target as HTMLInputElement).value
    this.dataSource.filter=filterValue.trim().toLowerCase()
  }

  onChange(status:any, id:any){
    this.ngx.start()
    var data={
      status:status.toString(),
      id:id
    }

    this.userService.update(data).subscribe((response:any)=>{
      this.ngx.stop();
      this.snackbar.openSnackbar(response.message,'');
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

}
