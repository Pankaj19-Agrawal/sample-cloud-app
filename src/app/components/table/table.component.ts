import {AfterViewInit, Component, ViewChild, Input, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MessageConstant } from 'src/app/constants/message.constants';
import { CommonService } from 'src/app/services/common.service';

export interface UserData {
  category: string;
  value: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit  {
  @Input() tableData:any;
  document:boolean = false;
  toggleButton:string = MessageConstant.TOGGLE_BUTTON_ONE;
  displayedColumns: string[] = ['category', 'value'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonService: CommonService) {
    // Create 100 users
    // const data = [{key:'mobile',value:'iPhone'},{key:'car',value:'honda'}] 

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(data);
  }

  ngOnInit(): void {
    console.log('table.component.ts 2',this.tableData);
    // const data = [{key:'mobile',value:'iPhone'},{key:'car',value:'honda'}] 
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggle(){
    this.document = !this.document
    if(this.document){
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_TWO
      this.abc();
    } 
    else{
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_ONE
    }
  }

  downloadDocument(){
    // let doc:any = document.getElementById('mydoc') as HTMLInputElement;
    this.Export2Word()
    // console.log('downloadDocument',doc);
    // let res = doc?.innerHTML;

    // // const blob = new Blob([res], { type: 'text/csv' });
    // // let allowedMimeType = ['application/pdf','application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // // const blob = new Blob([res], { type: 'application/msword' });
    // // const url = window.URL.createObjectURL(blob);
    // // window.open(url);

    //   var blob = new Blob([res], { type: 'application/msword' });
    //   var url = window.URL.createObjectURL(blob);
    //   var anchor = document.createElement("a");
    //   anchor.download = "myfile";
    //   anchor.href = url;
    //   anchor.click(); 
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


  abc(){
    let doc:any = document.getElementById('mydoc') as HTMLInputElement;
    let content = this.commonService.getFileContent();
    doc.innerHTML = content; 
    
    let contentJson = this.tableData;
    contentJson.forEach((item:any)=>{
      doc.innerHTML = doc.innerHTML.replace(item.value,`<span style="background:yellow">${item.value}</span>`)
    })
  } 

  Export2Word(filename = ''){
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var doc1:any = document.getElementById("mydoc") as HTMLInputElement 
    var html = preHtml + doc1.innerHTML + postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    
    // Specify file name
    filename = filename?filename+'.doc':'document.doc';
    
    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    
    const nav = (window.navigator as any);
    if(nav.msSaveOrOpenBlob ){
        nav.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;
        
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
    
    document.body.removeChild(downloadLink);
}

}

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