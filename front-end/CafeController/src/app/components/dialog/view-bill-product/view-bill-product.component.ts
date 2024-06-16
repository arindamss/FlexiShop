import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-view-bill-product',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule, MatTableModule],
  templateUrl: './view-bill-product.component.html',
  styleUrl: './view-bill-product.component.css'
})
export class ViewBillProductComponent implements OnInit {

  displayedColumns:string[]=['name','category','price','quantity','total']
  dataSource:any;
  data:any;

  constructor(@Inject(MAT_DIALOG_DATA) private dialogData:any,
    public dialogRef:MatDialogRef<ViewBillProductComponent>
  ){}

  ngOnInit(): void {
    this.data=this.dialogData.data;
    console.log(this.data);
    this.dataSource=JSON.parse(this.dialogData.data.productDetails)
    
  }



}
