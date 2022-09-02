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
	tableData:IfileContentJson[]
	selectedFiles: any;
	currentFileUpload: FileUpload;
	percentage: number;
	isPreElementCss:boolean = false;
	downloadButton: string = MessageConstant.DOWNLOAD_DOCUMENT;

	constructor(private fileUploadService: FileUploadService, private commonService: CommonService) { }

	//on file change
	onChange(event: any) {
		this.file = event.target;  
		this.loadPlainFile();
	}

	//on file upload
	onUpload() {
		this.setTableData();
		this.getPlainFileContent();
	}

	//pass data to table component
	setTableData() {
		this.tableData = [
			{
				category: 'test 1',
				value: 'The standard Lorem Ipsum passage, used since the 1500s'
			},
			{
				category: 'test 2',
				value: 'Hampden-Sydney College in Virginia'
			},
			{
				category: 'test 3',
				value: 'Itaque earum rerum hic tenetur a sapiente delectus,'
			}
		];
	}

	//set uploaded file data in textarea
	loadPlainFile(){
		let input = document.querySelector('input');
		let textArea:any = document.querySelector('textarea');

		let files:any = input?.files;
		const file = files[0];
		if(files?.length == 0) return;

		let reader = new FileReader();
		reader.onload = (e) =>{
			const file:any = e.target?.result;
			const lines = file.split(/\r\n|\n/);
			textArea.value = lines.join('\n');
		};

		reader.onerror = (e) => alert(e.target?.error?.name);
		reader.readAsText(file);
	}

	//get textarea content
	getPlainFileContent(){
		let content:any = document.querySelector('textarea')?.value;
		this.setPreElementContent(content);
	}

	//set content for pre element
	setPreElementContent(content:any){
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
	    preElement.innerHTML = content;
		this.isPreElementCss = true;
		this.convertPlainTextToHighlightedText(preElement);
	}

	//set highlighted text into pre element
	convertPlainTextToHighlightedText(preElement: any) {
		let contentJson = [
			{
				category: 'test 1',
				value: 'The standard Lorem Ipsum passage, used since the 1500s'
			},
			{
				category: 'test 2',
				value: 'Hampden-Sydney College in Virginia'
			},
			{
				category: 'test 3',
				value: 'Itaque earum rerum hic tenetur a sapiente delectus,'
			}
		];
		contentJson.forEach((item: IfileContentJson) => {
		  preElement.innerHTML = preElement.innerHTML.replace(item.value, '<span style="background:yellow" id="'+item.category+'" title="'+item.category+'">'+item.value+'</span>')
		});
	}

	//file download
	downloadFile() {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		this.fileUploadService.exportFile(preElement);
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

}
