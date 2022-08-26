import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUploadService } from './file-upload.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
	@Output() jsonData: EventEmitter<any> = new EventEmitter<any>();
	uploadButton:string = MessageConstant.UPLOAD_BUTTON;
	// Variable to store shortLink from api response
	shortLink: string = "";
	loading: boolean = false; // Flag variable
	file = null; // Variable to store file

	// Inject service
	constructor(private fileUploadService: FileUploadService, private commonService: CommonService) { }

	ngOnInit(): void {
	}

	// On file Select
	onChange(event:any) {
		// this.file = event.target.files[0];
		this.file = event.target;
		console.log('onChange',this.file);
		// this.onChangeShowFileText(event);
	}

	// OnClick of button Upload
	onUpload() {
		this.loading = !this.loading;
		
		// this.fileUploadService.upload(this.file).subscribe(
		// 	(event: any) => {
		// 		if (typeof (event) === 'object') {
		// 			// console.log('event',event)
		// 			// Short link via api response
		// 			this.shortLink = event.link;

		// 			this.loading = false; // Flag variable

		// 			// this.fileUploadService.abc(this.shortLink);
		// 		}
		// 	})

		this.getJsonOutput()
	}

	onChangeShowFileText(event:any){
		var input = event.target;
        var reader:any = new FileReader();
        reader.onload = function(){
          var text = reader.result;
		//   this.commonService.setFileContent(text);
		  
          var node:any = document.getElementById('output');
          node.innerText = text;
        //   console.log(reader.result.substring(0, 200));
        };
        reader.readAsText(input.files[0]);
	}

	getJsonOutput(){
		let fileContentJson = [
            {
                category: 'Automobile',
                value: 'a usually four-wheeled vehicle designed primarily for passenger transportation'
            },
            {
                category: 'Computer-Science',
                value: 'Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems'
            }
        ]
		// this.commonService.setFileContentJson(fileContentJson);
		this.jsonData.emit(fileContentJson);
	}
}
