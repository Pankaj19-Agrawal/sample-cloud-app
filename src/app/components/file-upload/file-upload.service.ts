import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlConstant } from 'src/app/constants/url.constants';
import { MessageConstant } from 'src/app/constants/message.constants';

@Injectable({ providedIn: 'root' })

export class FileUploadService {
	baseApiUrl: string = UrlConstant.UPLOAD_FILE_URL;

	constructor(private http: HttpClient) { }

	upload(file: any): Observable<any> {
		const formData = new FormData();
		formData.append("file", file, file.name);
		return this.http.post(this.baseApiUrl, formData)
	}

	exportFile() {
		let fileName = MessageConstant.FILE_NAME.name1;
		let fileType = MessageConstant.FILE_TYPE.type1;
		let defaultFile = MessageConstant.FILE_NAME.default + MessageConstant.FILE_TYPE.default;
		let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
		let postHtml = "</body></html>";
		let doc: any = document.getElementById("mydoc") as HTMLInputElement
		let html = preHtml + doc.innerHTML + postHtml;
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
}
