import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { UrlConstant } from 'src/app/constants/url.constants';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUpload } from 'src/app/models/fileUpload';

@Injectable({ providedIn: 'root' })

export class FileUploadService {
	private basePath = UrlConstant.UPLOAD_FILE_CHILDPATH;
	fileNameWithStamp:string;
	pdfContent:string;
	otherBucket:any;
	constructor(
		private http: HttpClient,
		private db: AngularFireDatabase,
		private storage: AngularFireStorage
	) {
   		this.otherBucket = this.storage.storage.app.storage('cuad-retrain');
	}

	exportFile(doc:any) {
		let fileName = MessageConstant.FILE_NAME.name1;
		let fileType = MessageConstant.FILE_TYPE.type1;
		let defaultFile = MessageConstant.FILE_NAME.default + MessageConstant.FILE_TYPE.default;
		let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
		let postHtml = "</body></html>";
		let html = preHtml + doc.innerHTML + postHtml;
		// let html = preHtml + doc.value + postHtml;
		let blob = new Blob(['\ufeff', html], { type: 'application/msword' });
		let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
		fileName = fileName ? fileName + fileType : defaultFile;
		let downloadLink = document.createElement("a");
		document.body.appendChild(downloadLink);
		const nav = (window.navigator as any);
		if (nav.msSaveOrOpenBlob) {
			nav.msSaveOrOpenBlob(blob, fileName);
		} else {
			downloadLink.href = url;
			downloadLink.download = fileName;
			downloadLink.click();
		}
		document.body.removeChild(downloadLink);
	}

	uploadFileInRetrainBucket(file:any){
		const storageRef = this.otherBucket.ref().child(file?.file?.name);
		return storageRef.put(file.file);
	}

	pushFileToStorage(fileUpload: FileUpload, bucket: string) {
		const timestamp = Date.now() + '_';
		const filePath = `${timestamp + fileUpload.file.name}`;
		// const filePath = `${fileUpload.file.name}`;
		const storageRef = this.storage.ref(filePath);
		const uploadTask = this.storage.upload(filePath, fileUpload.file);
		uploadTask.snapshotChanges().pipe(
			finalize(() => {
				storageRef.getDownloadURL().subscribe(downloadURL => {
					fileUpload.url = downloadURL;
					fileUpload.name = fileUpload.file.name;
					this.saveFileData(fileUpload);
				});
			})
		).subscribe();
		return uploadTask.percentageChanges();
	}

	private saveFileData(fileUpload: FileUpload): void {
		this.setFileUploadUrl(fileUpload.url);
		this.db.list(this.basePath).push(fileUpload);
	}

	setFileUploadUrl(url:string){
		const arr = url.split('/o/');
		const newArr = arr[1]?.replace('PDF?','pdf?')?.split('.pdf?')
		this.fileNameWithStamp = newArr[0];
	}

	getFileNameWithStamp(){
		return this.fileNameWithStamp;
	}

	getFiles(numberItems:any): AngularFireList<FileUpload> {
		return this.db.list(this.basePath, ref =>
			ref.limitToLast(numberItems));
	}
	
	deleteFile(fileUpload: FileUpload): void {
		this.deleteFileDatabase(fileUpload.key)
			.then(() => {
				this.deleteFileStorage(fileUpload.name);
			})
			.catch(error => console.log(error));
	}

	private deleteFileDatabase(key: string): Promise<void> {
		return this.db.list(this.basePath).remove(key);
	}

	private deleteFileStorage(name: string): void {
		const storageRef = this.storage.ref(this.basePath);
		storageRef.child(name).delete();
	}

	getResponseFileContent(url:string) {
		return this.http.get(url);  
	}

	getTextFileContent(url:string) {
		return this.http.get(url, { responseType: 'text' });  
	}

	replaceFileData(url:string,data:any){
		return this.http.post(url,data); 
	}

	updateJsonFileData(url:string,data:any){
		return this.http.post(url,data); 
	}

	savePdfContent(content:string){
		this.pdfContent = content;
	}

	getPdfContent(){
		return this.pdfContent;
	}

	isDisableChooseFileButton(value:boolean){
		let inputTypeFile:any = document.getElementById("inputTypeFile") as HTMLInputElement;
		inputTypeFile.disabled = value;
	}

	filterFileName(name:string){
		const fileName = name.replace(/%20/g," ").replace(/%2C/g,",").replace(/%5B/g,"[").replace(/%5D/g,"]");
		return fileName;
	}
}
