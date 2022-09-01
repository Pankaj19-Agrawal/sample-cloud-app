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
		this.xyz();
	}

	getTextareaValue(){
		let value:any = document.querySelector('textarea')?.value;
		console.log(value);
		
		
		
		var plainText = value
		var rtf = this.convertToRtf(plainText);
		var plainText2 = this.convertToPlain(rtf);
		// console.log('rtf 1',rtf)
		// console.log('rtf 2',plainText2)


		this.abc(plainText2)
	}

	abc(value:any){
		var div = document.getElementById('mytext') as HTMLInputElement;
	    // var text = '<span style="background:red">hello</span>'
	    div.innerHTML = value
		this.showHighlightedDocument(div);
	}

	showHighlightedDocument(doc: any) {
		let contentJson = [
			{
				category: 'Automobile',
				value: 'a usually four-wheeled vehicle designed primarily for passenger transportation'
			},
			{
				category: 'Computer-Science',
				value: 'Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems'
			}
		];
		contentJson.forEach((item: IfileContentJson) => {
		  doc.innerHTML = doc.innerHTML.replace(item.value, `<span style="background:yellow" id="{{item.category}}">${item.value}</span>`)
		});
	}

	xyz(){
		let input = document.querySelector('input');
		let output:any = document.querySelector('textarea');
		let output2:any = document.getElementById('mytext') as HTMLInputElement;

		let files:any = input?.files;
		const file = files[0];
		if(files?.length == 0) return;

		let reader = new FileReader();
		reader.onload = (e) =>{
			const file:any = e.target?.result;
			const lines = file.split(/\r\n|\n/);
			output.value = lines.join('\n');
			output2.innerHTML = lines.join('\n');
		};

		reader.onerror = (e) => alert(e.target?.error?.name);
		reader.readAsText(file);

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

	

convertToRtf(plain:any) {
    plain = plain.replace(/\n/g, "\\par\n");
    return "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 " + plain + "\\par\n}";
}

convertToPlain(rtf:any) {
    rtf = rtf.replace(/\\par[d]?/g, "");
    return rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
}

}


// a(event:any){
// 	var fr=new FileReader();
// 		fr.onload=function(){
// 			let ab:any = document.getElementById('output') as HTMLInputElement
// 					ab.innerHTML = fr.result;
// 		}
		  
// 		fr.readAsText(event.target.files[0])
// }