import { Component, OnInit } from '@angular/core';
import { MessageConstant } from 'src/app/constants/message.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title:string = MessageConstant.APP_TITLE;
  imgPath:string = MessageConstant.HEADER_IMG_PATH;
  constructor() { }

  ngOnInit(): void {
  }

}
