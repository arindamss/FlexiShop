import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryDialogComponent } from '../dialog/category-dialog/category-dialog.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatButtonModule, CommonModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  isSidebarVisible=true;

  displayColumns:string[]=['name','edit']
  dataSource:any;
  responseMessage:any;

  constructor(private sidebarService:SidebarService,
    private route:Router,
    private ngx:NgxUiLoaderService,
    private snackbar:SnackbarService,
    private dialog:MatDialog,
    private categoryService:CategoryService
  ){}

  ngOnInit(){
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
    this.ngx.start()
    this.tableData();
  }

  tableData(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.ngx.stop();
      this.dataSource=new MatTableDataSource(response);
    },(error:any)=>{
      this.ngx.stop();
      // console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error);

    })
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    console.log(filterValue);
    this.dataSource.filter=filterValue.trim().toLowerCase();
  }

  handleAction(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action: 'Add'
    };
    dialogConfig.width="850px";
    const dialogRef=this.dialog.open(CategoryDialogComponent, dialogConfig);
    this.route.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub=dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }

  handleEditAction(values:any){

    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={
      action: 'Edit',
      data:values
    };
    dialogConfig.width="850px";
    const dialogRef=this.dialog.open(CategoryDialogComponent, dialogConfig);
    this.route.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub=dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
      this.tableData();
    })
  }

}
