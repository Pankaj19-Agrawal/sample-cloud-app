import { AfterViewInit, Component, ViewChild, Input, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageConstant } from 'src/app/constants/message.constants';
import { CommonService } from 'src/app/services/common.service';
import { iHeader } from 'src/app/models/tableHeader.model';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { FileUploadService } from '../file-upload/file-upload.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit {
  @Input() tableData: IfileContentJson[];
  document: boolean = false;
  toggleButton: string = MessageConstant.TOGGLE_BUTTON_ONE;
  downloadButton: string = MessageConstant.DOWNLOAD_DOCUMENT;
  tableHeader: iHeader = MessageConstant.TABLE_HEADER;
  displayedColumns: string[] = MessageConstant.JSON_PROPERTIES;
  dataSource: MatTableDataSource<IfileContentJson>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonService: CommonService, private fileUploadService: FileUploadService) { }

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

  toggle() {
    this.document = !this.document
    if (this.document) {
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_TWO
      this.showPlainDocument();
    }
    else {
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_ONE
    }
  }

  showPlainDocument() {
    let doc: any = document.getElementById('mydoc') as HTMLInputElement;
    let content = this.commonService.getFileContent();
    doc.innerHTML = content;
    this.showHighlightedDocument(doc);
  }

  showHighlightedDocument(doc: any) {
    let contentJson = this.tableData;
    contentJson.forEach((item: IfileContentJson) => {
      doc.innerHTML = doc.innerHTML.replace(item.value, `<span style="background:yellow">${item.value}</span>`)
    });
  }

  downloadFile() {
    this.fileUploadService.exportFile();
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