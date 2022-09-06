import { Component, EventEmitter, Output } from '@angular/core';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUploadService } from './file-upload.service';
import { CommonService } from 'src/app/services/common.service';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { FileUpload } from 'src/app/models/fileUpload';
import { UrlConstant } from 'src/app/constants/url.constants';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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

	constructor(
		private fileUploadService: FileUploadService, 
		private commonService: CommonService,
		private storage: AngularFireStorage
	) { 
		
	}

	//on file change
	onChange(event: any) {
		this.file = event.target;  
		this.loadPlainFile();
		this.selectedFiles = event.target.files;
	}

	//on file upload
	// onUpload() {
	// 	this.setTableData();
	// 	this.getPlainFileContent();
	// }

	//to upload file in gcp bucket
	onUpload() {
		const file = this.selectedFiles.item(0);
		this.selectedFiles = undefined;
		this.currentFileUpload = new FileUpload(file);
		this.fileUploadService.pushFileToStorage(this.currentFileUpload).subscribe(
			(percentage: any) => {
				this.percentage = Math.round(percentage);
				if(this.percentage == 100) 
					this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.success);
				this.getResponseFileUrl();
			},
			error => {
				this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.fail);
				console.log(error);
			}
		);
	}

	//get response file url
	getResponseFileUrl(){
		const filePath:string = UrlConstant.UPLOAD_FILE_CHILDPATH + UrlConstant.RESPONSE_FILE_NAME;
		this.storage.ref(filePath).getDownloadURL().subscribe((url: string) => {
			this.getResponseFileContent(url);
		});
	}

	//get content for table
	getResponseFileContent(url:string){
		this.fileUploadService.getResponseFileContent(url).subscribe((res:any)=>{
			this.setTableData(res);
		});
	}

	//pass data to table component
	setTableData(data:IfileContentJson[]) {
		this.tableData = data;
		this.getPlainFileContent();
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
		let contentJson = this.tableData;
		contentJson.forEach((item: IfileContentJson, i: number) => {
		  preElement.innerHTML = preElement.innerHTML.replace(item.value, '<span style="background:yellow" id="'+item.category+i+'" title="'+item.category+'">'+item.value+'</span>')
		});
	}

	//file download
	downloadFile() {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		this.fileUploadService.exportFile(preElement);
	}

	//category updated inside table
	onCategoryUpdate(data:any){
		const index = data.index;
		const newCategory = data.newCategory;
		this.tableData[index].category = newCategory;
		this.getPlainFileContent();

		//one more thing need to do here
		//need to upload json file in gcp bucket
		//with value 
		// {modelPrediction:'abc',actualPrediction:'xyz',value:'asdsdfsdsaf'}
		this.saveActualPrediction(data);
	}

	saveActualPrediction(obj:any){
		const url = "https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o/uploads%2FactualPrediction.json?alt=media&token=953f1c78-267f-4930-bcbe-b1d4a9a9f243";
		const data = [
			{
				"modelPrediction": obj.category,
				"actualPrediction": obj.newCategory,
				"text": obj.value
			}
		];
		this.fileUploadService.replaceFileData(url,data).subscribe(res=>{
			console.log('res',res);
			this.temporaryUpdateResponseJsonFile(obj);
		})
	}

	temporaryUpdateResponseJsonFile(obj:any){
		const responseJson = [
			{
				"category": "test 1",
				"value": "The standard Lorem Ipsum passage, used since the 1600s"
			},
			{
				"category": "test 2",
				"value": "Hampden-Sydney College in Virginia"
			},
			{
				"category": "test 3",
				"value": "Itaque earum rerum hic tenetur a sapiente delectus,"
			},
			{
				"category": "test 1",
				"value": "(The Extremes of Good and Evil)"
			},
			{
				"category": "test 1",
				"value": "anything embarrassing hidden in the middle of text"
			}
		];
		const url = "https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o/uploads%2Fresponse.json?alt=media&token=ee31e272-c0e2-4ea1-b988-28a9db33700b"
		responseJson[obj.index].category = obj.newCategory;
		this.fileUploadService.updateJsonFileData(url,responseJson).subscribe(res=>{
			console.log('res',res);
		})
	}
}
