import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProductDialogComponent } from '../dialog/product-dialog/product-dialog.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatButtonModule, CommonModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit {

  isSidebarVisible=true;

  displayColumns: string[]=['name','categoryName','discription','price','edit']
  dataSource:any;
  responseMessage:any;

  constructor(private sidebarService:SidebarService,
    private productService:ProductService,
    private ngx:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbar:SnackbarService,
    private route:Router
  ){}

  ngOnInit(){
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
    this.ngx.start();
    this.tableData();
  }

  tableData(){
    this.productService.getProduct().subscribe((response:any)=>{
      this.ngx.stop();
      this.dataSource=new MatTableDataSource(response)
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase()
  }

  handleAddAction(){
    const dialogconfig=new MatDialogConfig();
    dialogconfig.data={
      action:"Add"
    }
    dialogconfig.width="850px"
    const dialogRef=this.dialog.open(ProductDialogComponent, dialogconfig)
    this.route.events.subscribe((response:any)=>{
      dialogRef.close()
    })

    const sub=dialogRef.componentInstance.onAddProduct.subscribe((response:any)=>{
      this.tableData();
    })
  }

  handleEditAction(values:any){
    const dialogconfig=new MatDialogConfig();
    dialogconfig.data={
      action:"Edit",
      data:values
    }
    dialogconfig.width="850px"
    const dialogRef=this.dialog.open(ProductDialogComponent, dialogconfig)
    this.route.events.subscribe((response:any)=>{
      dialogRef.close()
    })

    const sub=dialogRef.componentInstance.onEditProduct.subscribe((response:any)=>{
      this.tableData();
    })
  }

  handleDeleteAction(values:any){
    const dialogconfig=new MatDialogConfig()
    dialogconfig.data={
      message:'delete '+values.name+' product',
      confirmation:true
    }
    const dialogRef=this.dialog.open(ConfirmationComponent, dialogconfig);
    const sub=dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      this.ngx.start()
      this.deleteProduct(values.id);
      dialogRef.close()
    })
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.ngx.stop()
      this.tableData();
      this.responseMessage=response?.message
      this.snackbar.openSnackbar(this.responseMessage,'');
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }


  onChange(status:any, id:any){
    console.log("OnChange, I am Called");
    this.ngx.start()
    var data={
      status: status.toString(),
      id:id
    }

    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngx.stop();
      this.responseMessage=response?.message
      this.snackbar.openSnackbar(this.responseMessage,'')
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error);
    })
  }
}
