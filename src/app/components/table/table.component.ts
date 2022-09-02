import { AfterViewInit, Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { MessageConstant } from 'src/app/constants/message.constants';
import { iHeader } from 'src/app/models/tableHeader.model';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { EditDialogComponent } from 'src/app/components/edit-dialog/edit-dialog.component';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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

  openDialog(row:IfileContentJson){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: MessageConstant.DIALOG_WIDTH,
      data: row,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result){
        row.category = result;
        this.dataSource.paginator = this.paginator;
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