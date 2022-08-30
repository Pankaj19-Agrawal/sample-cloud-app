import { Component, EventEmitter, Output } from '@angular/core';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUploadService } from './file-upload.service';
import { CommonService } from 'src/app/services/common.service';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { FileUpload } from 'src/app/models/fileUpload';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
	@Output() jsonData: EventEmitter<IfileContentJson[]> = new EventEmitter<IfileContentJson[]>();
	uploadButton: string = MessageConstant.UPLOAD_BUTTON;
	file = null;

	selectedFiles: any;
	currentFileUpload: FileUpload;
	percentage: number;

	constructor(private fileUploadService: FileUploadService, private commonService: CommonService) { }

	onChange(event: any) {
		this.file = event.target;
		// this.selectedFiles = event.target.files;
	}

	onUpload() {
		// this.fileUploadService.upload(this.file).subscribe((res: IfileContentJson) => {
		// 	if (typeof (res) === 'object') {}
		// });

		this.getJsonOutput()
	}

	// onUpload() {
	// 	const file = this.selectedFiles.item(0);
	// 	this.selectedFiles = undefined;
	// 	this.currentFileUpload = new FileUpload(file);
	// 	this.fileUploadService.pushFileToStorage(this.currentFileUpload).subscribe(
	// 		(percentage: any) => {
	// 			this.percentage = Math.round(percentage);
	// 		},
	// 		error => {
	// 			console.log(error);
	// 		}
	// 	);
	// }

	getJsonOutput() {
		let fileContentJson = [
			{
				category: 'Automobile',
				value: 'a usually four-wheeled vehicle designed primarily for passenger transportation'
			},
			{
				category: 'Computer-Science',
				value: 'Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems'
			}
		];
		this.jsonData.emit(fileContentJson);
	}
}
