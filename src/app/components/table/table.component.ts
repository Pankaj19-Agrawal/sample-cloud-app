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
    let doc:any = document.getElementById('#mydoc') as HTMLInputElement;
    // console.log('downloadDocument',doc);
    let res = doc?.innerHTML;

    // const blob = new Blob([res], { type: 'text/csv' });
    // let allowedMimeType = ['application/pdf','application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    // const blob = new Blob([res], { type: 'application/msword' });
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);

      var blob = new Blob([res], { type: 'application/msword' });
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = "myfile";
      anchor.href = url;
      anchor.click();
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
    let doc:any = document.getElementById('#mydoc') as HTMLInputElement;
    let content = this.commonService.getFileContent();
    doc.innerHTML = content; 
    
    let contentJson = this.tableData;
    contentJson.forEach((item:any)=>{
      doc.innerHTML = doc.innerHTML.replace(item.value,`<span style="background:yellow">${item.value}</span>`)
    })
  } 

}
