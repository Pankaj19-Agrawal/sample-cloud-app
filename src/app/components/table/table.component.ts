import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MessageConstant } from 'src/app/constants/message.constants';

export interface UserData {
  key: string;
  value: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit  {
  document:boolean = false;
  toggleButton:string = MessageConstant.TOGGLE_BUTTON_ONE;
  displayedColumns: string[] = ['key', 'value'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    const data = [{key:'mobile',value:'iPhone'},{key:'car',value:'honda'}] 

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(data);
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
    if(this.document) 
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_TWO
    else
      this.toggleButton = MessageConstant.TOGGLE_BUTTON_ONE
  }

  downloadDocument(){

  }

}
