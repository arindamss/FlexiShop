import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalConstants } from '../shared/global-constants';
import { ViewBillProductComponent } from '../dialog/view-bill-product/view-bill-product.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltip],
  templateUrl: './view-bill.component.html',
  styleUrl: './view-bill.component.css'
})
export class ViewBillComponent implements OnInit {

  isSidebarVisible=true;

  displayedColumns:string[]=['name','email','contactNumber','paymentMethod','total','view']
  dataSource:any;
  responseMessage:any;

  constructor(private sidebarService:SidebarService,
    private billService:BillService,
    private ngx:NgxUiLoaderService,
    private snackbar:SnackbarService,
    private router:Router,
    private dialog:MatDialog
  ){}

  ngOnInit(): void {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
    this.ngx.start()
    this.tableData();
  }

  tableData(){
    this.billService.getBills().subscribe((response:any)=>{
      this.ngx.stop();
      this.dataSource=new MatTableDataSource(response)
    },(error:any)=>{
      this.ngx.stop();
      if(error.error?.message){
        this.responseMessage=error.error.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbar.openSnackbar(this.responseMessage, GlobalConstants.error)
    })
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.dataSource.filter=filterValue.trim().toLowerCase()
  }

  handleViewAction(values:any){
    const dialogConfig=new MatDialogConfig()
    dialogConfig.data={
      data:values
    }
    dialogConfig.width="850px"
    const dialogRef=this.dialog.open(ViewBillProductComponent,dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
  }

  dowenloadReportAction(value:any){
    this.ngx.start()
    var data={
      name:value.name,
      email:value.email,
      contactNumber:value.contactNumber,
      paymentMode:value.paymentMode,
      totalAmount:value.total.toString(),
      productDetails:value.productDetails,
      uuid:value.uuid
    }
    console.log("UUID : "+value.uuid+" Data : ",data)
    this.dowenloadFile(value.uuid,data);
  }

  dowenloadFile(fileName:any, data:any){
    this.billService.getPdf(data).subscribe((response)=>{
      saveAs(response,fileName+'.pdf')
      this.ngx.stop();
    })
  }

  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data={
      message:'delete '+value.name+' bill',
      confirmation:true
    }
    const dialogRef=this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      this.ngx.start();
      this.deleteBill(value.id);
      dialogRef.close()
    })
  }

  deleteBill(id:any){
    this.billService.delete(id).subscribe((response:any)=>{
      this.ngx.stop()
      this.tableData();
      this.responseMessage=response?.message
      this.snackbar.openSnackbar(this.responseMessage,'')
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }
      else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackbar.openSnackbar(this.responseMessage,GlobalConstants.error)
    })
  }

}
