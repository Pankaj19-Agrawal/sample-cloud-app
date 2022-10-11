import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageConstant } from 'src/app/constants/message.constants';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {
  message:string = MessageConstant.DELETE_MESSAGE;
  dialogButton = MessageConstant.DIALOG_BUTTON;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  remove(){
    this.dialogRef.close(true);
  }

}
