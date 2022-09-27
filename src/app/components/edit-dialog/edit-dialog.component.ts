import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { MessageConstant } from 'src/app/constants/message.constants';
import { CommonService } from 'src/app/services/common.service';
import { UrlConstant } from 'src/app/constants/url.constants';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  category:string;
  list:any;    //rename and typing
  selectedCategory:string;
  textAreaValue:string;
  newCategory:string;
  dialogButton = MessageConstant.DIALOG_BUTTON;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    console.log('keys from here',this.data.allData);
    this.data.allData.map((element:IfileContentJson)=> { return element.category });
    this.list = this.data.allData.map((element:IfileContentJson)=> { return element.category });
    this.selectedCategory = this.data.row.category;
  }

  cancel(): void {
    console.log('this.textAreaValue',this.textAreaValue);
    this.dialogRef.close();
  }

  update(){
    const obj = {
      category: this.data.row.category,
      newCategory: this.newCategory,
      value: this.data.row.value
    }
    this.dialogRef.close(obj);
  }

  getCategory(event:any){
    console.log('selected category', event.value);
    this.newCategory = event.value;
  }
}
