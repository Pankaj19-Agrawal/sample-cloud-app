import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { MessageConstant } from 'src/app/constants/message.constants';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  category:string;
  dialogButton = MessageConstant.DIALOG_BUTTON;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IfileContentJson
  ) { }

  ngOnInit(): void {
    this.category = this.data.category;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
