import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, delay, finalize, retryWhen, take } from 'rxjs/operators'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { UrlConstant } from 'src/app/constants/url.constants';
import { MessageConstant } from 'src/app/constants/message.constants';
import { FileUpload } from 'src/app/models/fileUpload';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class FileUploadService {
	private basePath = UrlConstant.UPLOAD_FILE_CHILDPATH;
	constructor(
		private http: HttpClient,
		private db: AngularFireDatabase,
		private storage: AngularFireStorage,
		private fireFunction: AngularFireFunctions
	) { }

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
		// let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(html);
		// let url = 'data:application/octet-stream,' + encodeURIComponent(html);
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

	pushFileToStorage(fileUpload: FileUpload) {
		const timestamp = Date.now() + '_';
		// const filePath = `${this.basePath}/${timestamp + fileUpload.file.name}`;
		const filePath = `${this.basePath}/${fileUpload.file.name}`;
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
		console.log('2',fileUpload)
		this.db.list(this.basePath).push(fileUpload);
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

	getResponseFileContent(url:string){
		return this.http.get(url)
			.pipe(
				catchError((err) => {
			  		return throwError(err);
				})
		  	)
	}

	replaceFileData(url:string,data:any){
		return this.http.post(url,data); 
	}

	updateJsonFileData(url:string,data:any){
		return this.http.post(url,data); 
	}

	//api for file upload

	//version 1 working
	uploadFileApi(fileName:string): Observable<any>{
		const url:string = UrlConstant.UPLOAD_FILE_URL;
		const body = { message: fileName };
		const token:string = MessageConstant.BEARER_TOKEN;
		const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
		return this.http.post(url,body,{headers})
	}

	//version 2 not working
	// uploadFileApi(functionName:string){
	// 	const callable = this.fireFunction.httpsCallable(functionName);
	// 	return callable({message:'DovaPharmaceuticalsInc_20181108_10-Q_EX-10.2_11414857_EX-10.2_Promotion Agreement.pdf'})
	// }

	//version 3 working
	// uploadFileApi(fileName:string){
		// var myHeaders = new Headers();
		// myHeaders.append("Authorization", "Bearer " +  MessageConstant.BEARER_TOKEN);
		// myHeaders.append("Content-Type", "application/json");
		// // myHeaders.append('Access-Control-Allow-Origin', 'https://us-gcp-ame-its-gbhqe-sbx-1.uc.r.appspot.com')

		// var raw = JSON.stringify({
		// 	"message": fileName
		// });

		// var requestOptions: any = {
		// 	method: 'POST',
		// 	headers: myHeaders,
		// 	body: raw,
		// 	redirect: 'follow'
		// };

		// fetch(UrlConstant.UPLOAD_FILE_URL + "?message=" + fileName + "&=", requestOptions)
		// 	.then(response => response.text())
		// 	.then(result => console.log(result))
		// 	.catch(error => console.log('error', error));
	// }

	//api for file upload end
}
