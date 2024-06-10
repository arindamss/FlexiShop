import { Component, EventEmitter, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  details:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any){}

  ngOnInit(): void {
    if(this.dialogData && this.dialogData.confirmation){
      this.details=this.dialogData;
    }
  }

  handelChangeAction(){
    this.onEmitStatusChange.emit();
  }

}
