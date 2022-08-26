import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sample-cloud-app';
  tableData:any;

  dataForTable(data:any){
    console.log('app.component.ts', data);
    this.tableData = data;
  }
}
