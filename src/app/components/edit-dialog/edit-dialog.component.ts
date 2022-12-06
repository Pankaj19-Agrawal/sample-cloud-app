import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { MessageConstant } from 'src/app/constants/message.constants';
import { CommonService } from 'src/app/services/common.service';
import { FileUploadService } from 'src/app/components/file-upload/file-upload.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  category:string;
  list:string;
  selectedCategory:string;
  textAreaValue:string;
  newCategory:string;
  dialogButton = MessageConstant.DIALOG_BUTTON;
  newText:string

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.list = this.data.copyOfTableData.map((element:IfileContentJson)=> { return element.category });
    this.selectedCategory = this.data?.row?.category;
    this.textAreaValue = this.data?.row?.value[0];
  }

  onKeyDown(){
    return false;
  }

  isDisabled(){
    let area = document.getElementById('text') as HTMLTextAreaElement; 
    if((this.selectedCategory == undefined) || (area.value == "")){
      return true;
    }else{
      return false;
    }
  }

  onPaste(event:ClipboardEvent){
    event.preventDefault();
    this.textAreaValue = '';
    let clipboardData = event.clipboardData as DataTransfer;
    this.searchInDocument(clipboardData);
  }

  searchInDocument(clipboardData:any){
    const doc = this.fileUploadService.getPdfContent();
    let area = document.getElementById('text') as HTMLTextAreaElement; 
    const text = clipboardData.getData('text');
    this.newText = text;
    const index = doc.indexOf(text);
    if(index > -1){
      area.value = clipboardData.getData('text');
    }else{
      this.commonService.openConfirmationSnackBar(MessageConstant.DOCUMENT_TEXT_ONLY);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  update(){
    const obj = {
      category: this.data.row.category,
      newCategory: this.newCategory,
      text: this.newText
    }
    if(this.newText == undefined) obj.text = this.textAreaValue
    if(this.newCategory == undefined) obj.newCategory = this.data.row.category
    this.dialogRef.close(obj);
  }

  add(){
    const obj = {
      category: '',
      newCategory: this.newCategory,
      text: this.newText
    }
    this.dialogRef.close(obj);
  }

  getCategory(event:any){
    this.newCategory = event.value;
  }
}
