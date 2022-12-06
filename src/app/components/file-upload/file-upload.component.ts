import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
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
	doc:string;
	temp:any;
	arr:any = [];

	constructor(
		private fileUploadService: FileUploadService,
		private commonService: CommonService,
		private storage: AngularFireStorage
	) {

	}

	onChange(event: any) {
		this.file = event.target;
		this.selectedFiles = event.target.files;
		this.uploadedFileName = this.selectedFiles[0].name;
		this.uploadedFileName.substring(0, this.uploadedFileName.length - 4)
		this.checkFileType(this.selectedFiles[0].type);
	}

	checkFileType(fileType:string){
		if(fileType === 'text/plain'){
			this.loadPlainFile();
		}else{
			//load pdf file
		}
	}

	onUpload() {
		const file = this.selectedFiles?.item(0);
		this.selectedFiles = undefined;
		this.currentFileUpload = new FileUpload(file);
		this.fileUploadService.pushFileToStorage(this.currentFileUpload,'cuad-test').subscribe(
			(percentage: any) => {
				this.percentage = Math.round(percentage);
				if (this.percentage == 100) {
					this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.success);
					this.reset();
					this.isLoading = true;
					setTimeout(()=>{this.getResponseFileUrl()},1000);
				}
			},
			error => {
				this.commonService.openSnackBar(MessageConstant.TOAST_MESSAGE.fail);
				this.reset();
				console.log(error);
			}
		);
	}

	reset() {
		this.fileInputVariable.nativeElement.value = null;
		this.file = null
	}

	getResponseFileUrl() {
		let fileName = this.fileUploadService.getFileNameWithStamp();
		fileName = fileName + UrlConstant.FILENAME_SUFFIX;
		this.storage.ref(fileName).getDownloadURL().subscribe((url: string) => {
			this.getResponseFileContent(url);
		},
			(error) => {
				setTimeout(() => {
					this.getResponseFileUrl();
				}, 60000);
			});
	}
	
	getResponseFileContent(url: string) {
		this.fileUploadService.getResponseFileContent(url).subscribe((res:any) => {
			let result = Object.keys(res).map(key => ({ category: key, value: res[key] }));
			let temp = JSON.parse(JSON.stringify(res));
			this.temp = Object.keys(temp).map(key => ({ actual_category: key, predicted_category: key, text: temp[key] }));
			this.temp.forEach((item:any)=>{
				item.text?.pop()
				item.text = item.text[0] 
			})
			if (result.length) this.setTableData(result);
		}); 
	}

	setTableData(data: IfileContentJson[]) {
		this.isLoading = false;
		this.tableData = data;
		this.getTextFileUrl();
		// this.getPlainFileContent();
	}

	getTextFileUrl(){
		let fileName = this.fileUploadService.getFileNameWithStamp();
		fileName = fileName + UrlConstant.TEXT_FILE_SUFFIX;
		this.storage.ref(fileName).getDownloadURL().subscribe((url: string) => {
			this.getTextFileContent(url);
		},
		(error) => {
			console.log('text file error',error);
		});
	}

	getTextFileContent(url:string){
		this.fileUploadService.getTextFileContent(url).subscribe(res=>{
			let textArea: any = document.querySelector('textarea');
			// this.temp.forEach((item:any, i: number)=>{
			// 	const start = item.value[2]
			// 	const end = item.value[3]
			// 	const sub = res.substring(start,end);
			// 	textArea.value = res.replace(sub,'<span style="background:yellow" id="' + item.category + i + '" title="' + item.category + '">' + sub + '</span>')
			// });

			//formated view
			textArea.value = res;
			//formated view

			//paragraph view
			// const lines = res.split(/\r\n|\n/);
			// textArea.value = lines.join('');
			//paragraph view

			this.getPlainFileContent();
			// console.log('textArea',textArea.value);
			
			let div: any = document.getElementById('div');
			// res = JSON.stringify(res);
			let newRes = res.replace(/[\n\r]/g," ");
			let newRes2 = newRes.replace(/\s{2,}/g, " ");
			this.fileUploadService.savePdfContent(newRes2);
			div.innerHTML = newRes2
			// console.log('div',div.innerHTML);

			// this.tableData.forEach((item: IfileContentJson, i: number) => {
			// 	const val = JSON.parse(JSON.stringify(item.value[0]));
			// 	div2.innerHTML = div2.innerHTML.replace(val, '<span style="background:yellow" id="' + item.category + i + '" title="' + item.category + '">' + val + '</span>')
			// });

			// let textArea: any = document.querySelector('textarea');
			// const lines = res.split(/\r\n|\n/);
			// textArea.value = lines.join('\n');
			// console.log('res',textArea.value);
			// // textArea.value = lines.join('');
			// // textArea.value = res;
			// this.getPlainFileContent();
		});
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
			preElement.innerHTML = preElement.innerHTML.replace(item.value[0].trim(), '<span style="background:yellow" id="' + item.category + i + '" title="' + item.category + '">' + item.value[0].trim() + '</span>')
		});
	}

	downloadFile() {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		this.fileUploadService.exportFile(preElement);
	}

	onCategoryUpdate(data: any) {
		const index = data.index;
		const newCategory = data.newCategory;
		if(index) this.tableData[index].category = newCategory;
		this.getPlainFileContent();		
		let obj = {
			"predicted_category": data.category,
			"actual_category": data.newCategory,
			"text": data.text,
		}
		this.arr.push(obj);
	}

	getUniqueArray(arr:any){
		let result = arr.reduce((unique:any, o:any) => {
			if(!unique.some((obj:any) => obj.modelPrediction === o.modelPrediction && obj.actualPrediction === o.actualPrediction && obj.text === o.text)) {
			  unique.push(o);
			}
			return unique;
		},[]);
		return result;
	}

	saveActualPrediction() {
		const data = this.prepareObject();
		this.transformData(data);
	}

	transformData(data:any){
		const str = JSON.stringify(data);
		const bytes = new TextEncoder().encode(str);
		const blob = new Blob([bytes], {type: "application/json"});
		let file = new File([blob], this.retrainFileNameWithTimestamp(), {type: "application/json"});
		const newFile = new FileUpload(file);
		this.fileUploadService.uploadFileInRetrainBucket(newFile).then((res:any) => {
			this.arr = [];
		});
	}

	retrainFileNameWithTimestamp(){
		const timestamp = Date.now() + '_';
		let fileName = this.fileUploadService.getFileNameWithStamp();
		return fileName = `${timestamp + fileName}`;
	}

	prepareObject(){
		let arr = this.getUniqueArray(this.arr)
		arr.forEach((element:any) => {
			let obj = this.temp.find((item:any) => item.predicted_category === element.predicted_category);
			if(obj){
				this.temp.splice(this.temp.indexOf(obj),1);
				this.temp.push(element);
			}else if(obj == undefined && element.predicted_category == ""){
				this.temp.push(element);
			}
		});
		let content: any = document.querySelector('textarea')?.value;
		content = JSON.stringify(content);
		const data = {
			content: content,
			output: this.temp
		}
		return data;
	}
}
