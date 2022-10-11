import { AfterViewInit, Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { MessageConstant } from 'src/app/constants/message.constants';
import { iHeader } from 'src/app/models/tableHeader.model';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { EditDialogComponent } from 'src/app/components/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() tableData: IfileContentJson[];
  tableHeader: iHeader = MessageConstant.TABLE_HEADER;
  displayedColumns: string[] = MessageConstant.JSON_PROPERTIES;
  dataSource: MatTableDataSource<IfileContentJson>;
  @Output() onCategoryUpdate: EventEmitter<IfileContentJson> = new EventEmitter<IfileContentJson>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tableData.forEach((item:IfileContentJson)=>{
      item.value[1] = item.value[1].toFixed(2);
    });
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openDialog(row:IfileContentJson,index:number){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: MessageConstant.DIALOG_WIDTH,
      data: {row:row,allData:this.tableData,mode:'edit'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        row.category = result.newCategory;
        row.value[0] = result.text;
        result.index = index;
        this.onCategoryUpdate.emit(result);
      }
    });
  }

  probability(row:IfileContentJson){
    if(row?.value[1] == 100.00){
      return 100;
    }else{
      return row?.value[1];
    }
  }

  addNewRow(result:any){
    const row = {
      category:result.newCategory,
      value:[result.text]
    }
    this.tableData.push(row);
    this.table.renderRows();
  }

  addRow(){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: MessageConstant.DIALOG_WIDTH,
      data: {allData:this.tableData,mode:'add'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.addNewRow(result);
      }
    });
  }

  removeRow(index:number){
    this.tableData.splice(index, 1);
    this.table.renderRows();
  }

  openDeleteDialog(index:number){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: MessageConstant.DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.removeRow(index);
      }
    });
  }

}



// DownloadFile(fileId): void {
//   this.requestService.DownloadVerifyFile(this.id,fileId).subscribe(response => {
//     const a = document.createElement('a')
//     const objectUrl = URL.createObjectURL(response)
//     a.href = objectUrl
//     a.download = response;
//     a.click();
//     URL.revokeObjectURL(objectUrl);
//   });
// }



// npm install file-saver --save
// npm install @types/file-saver --save


// import {saveAs} from 'file-saver';

// this.http.get('endpoint/', {responseType: "blob", headers: {'Accept': 'application/pdf'}})
//   .subscribe(blob => {
//     saveAs(blob, 'download.pdf');
//   })




// var plainText = "This is some test text.\n\nThis is the second line\n\n...third line";
// var rtf = convertToRtf(plainText);
// var plainText2 = convertToPlain(rtf);

// function convertToRtf(plain) {
//     plain = plain.replace(/\n/g, "\\par\n");
//     return "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 " + plain + "\\par\n}";
// }

// function convertToPlain(rtf) {
//     rtf = rtf.replace(/\\par[d]?/g, "");
//     return rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
// }

// console.log(rtf)