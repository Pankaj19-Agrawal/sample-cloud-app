import { Component } from '@angular/core';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tableData: IfileContentJson[];

  dataForTable(event: any) {
    this.tableData = event;
  }
}
