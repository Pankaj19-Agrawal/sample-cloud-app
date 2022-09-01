import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-document',
  templateUrl: './display-document.component.html',
  styleUrls: ['./display-document.component.css']
})
export class DisplayDocumentComponent implements OnInit {
  @Input() data:string;
  constructor() { }

  ngOnInit(): void {
  }

}
