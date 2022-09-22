import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { interval, Subscription } from 'rxjs';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUploadService } from './file-upload.service';
import { CommonService } from 'src/app/services/common.service';
import { IfileContentJson } from 'src/app/models/fileContentJson.model';
import { FileUpload } from 'src/app/models/fileUpload';
import { UrlConstant } from 'src/app/constants/url.constants';

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
	@Output() jsonData: EventEmitter<IfileContentJson[]> = new EventEmitter<IfileContentJson[]>();
	@ViewChild('fileInput') fileInputVariable: ElementRef;
	uploadButton: string = MessageConstant.UPLOAD_BUTTON;
	file = null;
	tableData: IfileContentJson[]
	selectedFiles: any;
	currentFileUpload: FileUpload;
	percentage: number;
	isPreElementCss: boolean = false;
	downloadButton: string = MessageConstant.DOWNLOAD_DOCUMENT;
	isLoading: boolean = false;
	uploadedFileName: string;

	constructor(
		private fileUploadService: FileUploadService,
		private commonService: CommonService,
		private storage: AngularFireStorage
	) {

	}

	onChange(event: any) {
		this.file = event.target;
		this.loadPlainFile();
		this.selectedFiles = event.target.files;
		this.uploadedFileName = this.selectedFiles[0].name;
		this.uploadedFileName.substring(0, this.uploadedFileName.length - 4)
	}

	onUpload() {
		const file = this.selectedFiles?.item(0);
		this.selectedFiles = undefined;
		this.currentFileUpload = new FileUpload(file);
		this.fileUploadService.pushFileToStorage(this.currentFileUpload).subscribe(
			(percentage: any) => {
				this.percentage = Math.round(percentage);
				if (this.percentage == 100) {
					this.showToastMessage();
					this.reset();
					this.getResponseFileUrl();
					this.isLoading = true;
				}
			},
			error => {
				this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.fail);
				this.reset();
				console.log(error);
			}
		);
	}

	showToastMessage() {
		this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.success);
	}

	reset() {
		this.fileInputVariable.nativeElement.value = null;
		this.file = null
	}

	showLoader() {
		this.isLoading = true;
	}

	hideLoader() {
		this.isLoading = false;
	}

	getResponseFileUrl() {
		let fileName = this.uploadedFileName.substring(0, this.uploadedFileName.length - 4);
		fileName = fileName + UrlConstant.FILENAME_SUFFIX;
		// const file1 = 'uploads/response.json'		//appspot.com
		this.storage.ref(fileName).getDownloadURL().subscribe((url: string) => {
			this.getResponseFileContent(url);
		},
			(error) => {
				setTimeout(() => {
					this.getResponseFileUrl();
				}, 100000);
			});
	}

	getResponseFileContent(url: string) {
		this.fileUploadService.getResponseFileContent(url).subscribe((res:any) => {
			this.isLoading = false;
			let result = Object.keys(res).map(key => ({ category: key, value: res[key] }));
			if (result.length) this.setTableData(result);
		}); 
	}

	setTableData(data: IfileContentJson[]) {
		this.tableData = data;
		this.hideLoader();
		this.getPlainFileContent();
	}

	loadPlainFile() {
		let input = document.querySelector('input');
		let textArea: any = document.querySelector('textarea');

		let files: any = input?.files;
		const file = files[0];
		if (files?.length == 0) return;

		let reader = new FileReader();
		reader.onload = (e) => {
			const file: any = e.target?.result;
			const lines = file.split(/\r\n|\n/);
			textArea.value = lines.join('\n');
		};

		reader.onerror = (e) => alert(e.target?.error?.name);
		reader.readAsText(file);
	}

	getPlainFileContent() {
		let content: any = document.querySelector('textarea')?.value;
		this.setPreElementContent(content);
	}

	setPreElementContent(content: any) {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		preElement.innerHTML = content;
		this.isPreElementCss = true;
		this.convertPlainTextToHighlightedText(preElement);
	}

	convertPlainTextToHighlightedText(preElement: any) {
		let contentJson = this.tableData;
		contentJson.forEach((item: IfileContentJson, i: number) => {
			preElement.innerHTML = preElement.innerHTML.replace(item.value[0], '<span style="background:yellow" id="' + item.category + i + '" title="' + item.category + '">' + item.value[0] + '</span>')
		});
	}

	downloadFile() {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		this.fileUploadService.exportFile(preElement);
	}

	onCategoryUpdate(data: any) {
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

	saveActualPrediction(obj: any) {
		const url = "https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o/uploads%2FactualPrediction.json?alt=media&token=953f1c78-267f-4930-bcbe-b1d4a9a9f243";
		const data = [
			{
				"modelPrediction": obj.category,
				"actualPrediction": obj.newCategory,
				"text": obj.value
			}
		];
		this.fileUploadService.replaceFileData(url, data).subscribe(res => {
			console.log('res', res);
		})
	}
}
