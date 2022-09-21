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

	getToken(){
		//client id = 472625191829-u1j8rfstkc2veqeascudgighhu4cvg23.apps.googleusercontent.com
		//client secret = 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
		//url = // https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o
		//url = // https://www.googleapis.com/auth/analytics
		//url = // https://www.googleapis.com/auth/documents
		//url = // https://www.googleapis.com/oauth2/v1/token
		//url = // https://us-gcp-ame-its-gbhqe-sbx-1.firebaseapp.com

		// var requestOptions: any = {
		// 	method: 'POST',
		// 	// headers: myHeaders,
		// 	body: {key:'472625191829-u1j8rfstkc2veqeascudgighhu4cvg23.apps.googleusercontent.com',value:'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'},
			
		// };

		// fetch("https://www.googleapis.com/oauth2/v1/token", requestOptions)
		// 	.then(response => response.text())
		// 	.then(result => console.log(result))
		// 	.catch(error => console.log('error', error));

		//https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=472625191829-u1j8rfstkc2veqeascudgighhu4cvg23.apps.googleusercontent.com&redirect_uri=http://localhost:5000'

		let url = "https://accounts.google.com/o/oauth2/v2/auth";
		let client_secret = "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";
		let client_id = "472625191829-u1j8rfstkc2veqeascudgighhu4cvg23.apps.googleusercontent.com";
		let redirect_uri = "http://localhost:5000";
		let response_type="code&";
		let request = new XMLHttpRequest();
		request.open("POST",url,true);
		request.setRequestHeader("Content-type","application/json");
		request.send("response_type="+response_type+"client_id="+client_id+"&client_secret="+client_secret+"&redirect_uri="+redirect_uri);
		// request.send("client_id="+client_id+"&"+"client_secret="+client_secret);
		request.onreadystatechange = function(){
			if(request.readyState == request.DONE){
				let response = request.responseText;
				// let obj = JSON.parse(response);
				console.log(response);
			}
		}
	}

	callApi() {
		// const fileName = 'DovaPharmaceuticalsInc_20181108_10-Q_EX-10.2_11414857_EX-10.2_Promotion Agreement.pdf';
		this.fileUploadService.uploadFileApi(this.uploadedFileName).subscribe((res)=>{
			console.log('new api res',res); 
			this.hideLoader();
		let result:any = Object.keys(res).map(key => ({ category: key, value: res[key] }));
			if (result.length) this.setTableData(result);
		});

		// let res:any = {"Agreement Date":["September 26, 2018",83.17562695687832]}
		// let result:any = Object.keys(res).map(key => ({ category: key, value: res[key] }));
		// 	if (result.length) this.setTableData(result);
	}

	//on file change
	onChange(event: any) {
		this.file = event.target;
		this.loadPlainFile();
		this.selectedFiles = event.target.files;
		this.uploadedFileName = this.selectedFiles[0].name;
		this.uploadedFileName.substring(0, this.uploadedFileName.length - 4)
	}

	//on file upload
	// onUpload() {
	// 	this.setTableData();
	// 	this.getPlainFileContent();
	// }

	//to upload file in gcp bucket
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
					// this.showLoader();
					// this.hideLoader();
					this.getResponseFileUrl();
					// this.callApi();
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
		setTimeout(() => {
			this.isLoading = true;
			// this.getResponseFileUrl();
		}, 1500);
	}

	hideLoader() {
		this.isLoading = false;
	}

	//get response file url
	getResponseFileUrl() {
		// this.showLoader();
		let fileName = this.uploadedFileName.substring(0, this.uploadedFileName.length - 4);
		fileName = fileName + UrlConstant.FILENAME_SUFFIX;
		// const file1 = 'uploads/response.json'		//appspot.com
		this.storage.ref(fileName).getDownloadURL().subscribe((url: string) => {
			this.getResponseFileContent(url);
			console.log('url-->',url)
			// this.test(url);
		},
			(error) => {
				setTimeout(() => {
					this.getResponseFileUrl();
				}, 100000);
			});
	}

	//get content for table
	getResponseFileContent(url: string) {
		this.fileUploadService.getResponseFileContent(url).subscribe((res) => {
			console.log('data-->',res);
			this.isLoading = false;
			// let result = Object.keys(res).map(key => ({ category: key, value: res[key] }));
			// if (result.length) this.setTableData(result);
		}); 
	}

	//pass data to table component
	setTableData(data: IfileContentJson[]) {
		this.tableData = data;
		this.hideLoader();
		//test code start
		// let content:any = document.querySelector('textarea')?.value;
		// let subStr = content.substring(140,447)
		// let myData = [{category:'test case 1',value:subStr}]
		// this.tableData = myData;
		//test code end
		this.getPlainFileContent();
	}

	//set uploaded file data in textarea
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

	//get textarea content
	getPlainFileContent() {
		let content: any = document.querySelector('textarea')?.value;
		this.setPreElementContent(content);
	}

	//set content for pre element
	setPreElementContent(content: any) {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		preElement.innerHTML = content;
		this.isPreElementCss = true;
		this.convertPlainTextToHighlightedText(preElement);
	}

	//set highlighted text into pre element
	convertPlainTextToHighlightedText(preElement: any) {
		let contentJson = this.tableData;
		contentJson.forEach((item: IfileContentJson, i: number) => {
			preElement.innerHTML = preElement.innerHTML.replace(item.value[0], '<span style="background:yellow" id="' + item.category + i + '" title="' + item.category + '">' + item.value[0] + '</span>')
		});
		// this.deleteThis()
		// test code start 
		// let subStr = preElement.innerHTML.substring(140,447)
		// console.log('subStr',subStr);
		// let newStr = '<span style="background:red" id="test case 10" title="test category 1">' + subStr + '</span>'
		// preElement.innerHTML = preElement.innerHTML.replace(subStr,newStr)
		// test code end
	}

	//file download
	downloadFile() {
		let preElement = document.getElementById('pre-element') as HTMLInputElement;
		// let preElement = document.querySelector('textarea');
		this.fileUploadService.exportFile(preElement);
	}

	deleteThis() {
		var csv = document.getElementById('pre-element') as HTMLInputElement;
		var data = new Blob(['\ufeff', csv?.innerHTML]);
		var a2 = document.getElementById("a2") as HTMLAnchorElement;
		a2.href = URL.createObjectURL(data);
	}

	//category updated inside table
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
			this.temporaryUpdateResponseJsonFile(obj);
		})
	}

	temporaryUpdateResponseJsonFile(obj: any) {
		// let responseJson = {
		// 	"Document Name": "CO-PROMOTION AGREEMENT",
		// 	"Parties": "Dova Pharmaceuticals, Inc., a Delaware corporation (\"Dova\"), and Valeant Pharmaceuticals North America LLC, a Delaware limited liability company (\"Valeant\"). Dova and Valeant are each referred to individually as a \"Party\" and together as the \"Parties\".",
		// 	"Agreement Date": "September 26, 2018",
		// 	"Effective Date": "September 26, 2018",
		// 	"Expiration Date": "This Agreement shall become effective as of the Effective Date and, unless earlier terminated as provided in this ARTICLE 12, shall extend until the four (4) year anniversary of the Effective Date (the \"Term\").",
		// 	"Renewal Term": "This Agreement shall become effective as of the Effective Date and, unless earlier terminated as provided in this ARTICLE 12, shall extend until the four (4) year anniversary of the Effective Date (the \"Term\").",
		// 	"Governing Law": "This Agreement and any and all matters arising directly or indirectly herefrom shall be governed by and construed and enforced in accordance with the internal laws of the [***] applicable to agreements made and to be performed entirely in such state, including its statutes of limitation but without giving effect to the conflict of law principles thereof.",
		// 	"Most Favored Nation": "Notwithstanding the terms of this Section 4.2.1, Valeant shall have the right, from time to time, during the Term, to include in the incentive compensation package of all or some of the Sales Representatives a spiff, spiv or other similar incentive bonus that is based on [***], provided that the actual, maximum payout from such incentive bonuses does not exceed, in the aggregate, an amount equal to [***] for each Sales Representative for each Calendar Quarter.",
		// 	"Non-Compete": "[***], neither Valeant nor its Affiliates shall, directly or indirectly, [***] in the Territory other than the Product; provided that if the Agreement is terminated by Dova pursuant to [***], then any Tail Period shall be immediately terminated if either Valeant or any of its Affiliates, directly or indirectly, [***] in the Territory other than the Product during such Tail Period.",
		// 	"Exclusivity": "During the Term, subject to the terms and conditions of this Agreement, Dova hereby grants to Valeant the right, on a co-exclusive basis (solely with Dova and its Affiliates), to Detail and promote the Product in the Specialty in the Territory in the Field, and to conduct the Valeant Activities and the activities of the institutional account management team (pursuant to and subject to the terms of Section 4.1.5) for the Product in the Territory in the Field in accordance with the terms and conditions of this Agreement.",
		// 	"No-Solicit Of Customers": "[***], neither Valeant nor Dova (nor any of their respective Affiliates) shall directly or indirectly solicit for hire or employee as an employee, consultant or otherwise any of the other Party's professional personnel who have had direct involvement with the JSC, with the Valeant Activities under this Agreement (which, in the case of Valeant, includes the Field Force Personnel) or with Dova's commercialization activities for the Product, without the other Party's prior written consent.",
		// 	"Competitive Restriction Exception": "Valeant shall have no other rights relating to the Product, except as specifically set forth in this Agreement and, without limiting the foregoing, except as set out in Section 4.1.5, if agreed upon, Valeant shall have no right to, and shall not, conduct the Valeant Activities for the Product outside the Specialty or outside the Territory or for use outside the Field.",
		// 	"No-Solicit Of Employees": "[***], neither Valeant nor Dova (nor any of their respective Affiliates) shall directly or indirectly solicit for hire or employee as an employee, consultant or otherwise any of the other Party's professional personnel who have had direct involvement with the JSC, with the Valeant Activities under this Agreement (which, in the case of Valeant, includes the Field Force Personnel) or with Dova's commercialization activities for the Product, without the other Party's prior written consent.",
		// 	"Non-Disparagement": "Valeant shall not at any time during the Term knowingly do or allow to be done any act or thing which will in any way impair or diminish the rights of Dova in or to the Dova Trademarks and Copyrights.",
		// 	"Termination For Convenience": "Either Party shall have the right to terminate this Agreement before the end of the Term for its convenience upon [***] written notice to the other Party (and any such termination shall become effective at the end of such [***]); [***].",
		// 	"Rofr/Rofo/Rofn": "Any obligation of Valeant under or pursuant to this Agreement may be satisfied, met or fulfilled, in whole or in part, at Valeant's sole and exclusive option, either by Valeant or its Affiliates.",
		// 	"Change Of Control": "Except as provided in this Section 13.2, this Agreement may not be assigned or otherwise transferred, nor may any rights or obligations hereunder be assigned or transferred, by either Party, without the written consent of the other Party (such consent not to be unreasonably withheld); provided that a merger, sale of stock or comparable transaction shall not constitute an assignment.",
		// 	"Anti-Assignment": "Except as provided in this Section 13.2, this Agreement may not be assigned or otherwise transferred, nor may any rights or obligations hereunder be assigned or transferred, by either Party, without the written consent of the other Party (such consent not to be unreasonably withheld); provided that a merger, sale of stock or comparable transaction shall not constitute an assignment.",
		// 	"Revenue/Profit Sharing": "Commencing with the Calendar Quarter commencing on October 1, 2018, as consideration for the Valeant Activities performed by Valeant, Dova shall pay Valeant a promotion fee based on annual Net Sales during the Term, calculated as follows: (a) For any portion of Net Sales up to and equal [***] in a Calendar Year, an amount equal to [***] of such portion of Net Sales; (b) For any portion of Net Sales in excess of [***] and up to and equal [***] in a Calendar Year, an amount equal to [***] of such portion of Net Sales; and (c) For any portion of Net Sales in excess of [***] in a Calendar Year, [***] of such portion of Net Sales.",
		// 	"Minimum Commitment": "\"Quarterly Minimum Details\" for an applicable Calendar Quarter shall mean [***].",
		// 	"Volume Restriction": "(i) the number of units of such SKU of Products shipped by Dova (or its Affiliates or its Intermediaries) to the Non-Retail Institutions in the Territory during an applicable period (excluding any shipments in excess of one unit of either SKU shipped to such Non-Retail Institutions based on the initial orders from such Non-Retail Institutions): MULTIPLIED BY (ii) the applicable Specialty Fraction for such SKU of the Product for the applicable period, MULTIPLIED BY (iii) the applicable WAC for such SKU of the Product for the applicable period, MULTIPLIED BY (iv) the Gross to Net Fraction for such SKU of the Product for the applicable period.",
		// 	"Ip Ownership Assignment": "As between the Parties, Dova shall own all right, title and interest in and to any Product Materials (and all content contained therein) and any Product Labeling (and all content contained therein), including applicable copyrights and trademarks (other than any name, trademark, trade name or logo of Valeant or its Affiliates that may appear on such Product materials or Product Labeling), and to the extent Valeant (or any of its Affiliates) obtains or otherwise has a claim to any of the foregoing, Valeant hereby assigns (and shall cause any applicable Affiliate to assign) all of its right, title and interest in and to such Product Materials (and content) and Product Labeling (and content) (other than any name, trademark, trade name or logo of Valeant or its Affiliates that may appear on such Product materials or Product Labeling) to Dova and Valeant agrees to (and shall cause its applicable Affiliate to) execute all documents and take all actions as are reasonably requested by Dova to vest title to such Product Materials (and content) and Product Labeling (and content) in Dova (or its designated Affiliate).",
		// 	"Joint Ip Ownership": "As between the Parties, Dova shall own all right, title and interest in and to any Product Materials (and all content contained therein) and any Product Labeling (and all content contained therein), including applicable copyrights and trademarks (other than any name, trademark, trade name or logo of Valeant or its Affiliates that may appear on such Product materials or Product Labeling), and to the extent Valeant (or any of its Affiliates) obtains or otherwise has a claim to any of the foregoing, Valeant hereby assigns (and shall cause any applicable Affiliate to assign) all of its right, title and interest in and to such Product Materials (and content) and Product Labeling (and content) (other than any name, trademark, trade name or logo of Valeant or its Affiliates that may appear on such Product materials or Product Labeling) to Dova and Valeant agrees to (and shall cause its applicable Affiliate to) execute all documents and take all actions as are reasonably requested by Dova to vest title to such Product Materials (and content) and Product Labeling (and content) in Dova (or its designated Affiliate).",
		// 	"License Grant": "[***], Valeant hereby grants to Dova a fully paid-up, royalty free, non-transferable, non- exclusive license (with a limited right to sub-license to its Affiliates) to any Valeant Property that appears on, embodied on or contained in the Product materials or Product Labeling solely for use in connection with Dova's promotion or other commercialization of the Product in the Territory.",
		// 	"Non-Transferable License": "Except to Affiliates of Valeant, Valeant's rights and obligations under this Section 2.1 are non-transferable, non-assignable, and non-delegable.",
		// 	"Affiliate License-Licensor": "[***], Valeant hereby grants to Dova a fully paid-up, royalty free, non-transferable, non- exclusive license (with a limited right to sub-license to its Affiliates) to any Valeant Property that appears on, embodied on or contained in the Product materials or Product Labeling solely for use in connection with Dova's promotion or other commercialization of the Product in the Territory.",
		// 	"Affiliate License-Licensee": "[***], Valeant hereby grants to Dova a fully paid-up, royalty free, non-transferable, non- exclusive license (with a limited right to sub-license to its Affiliates) to any Valeant Property that appears on, embodied on or contained in the Product materials or Product Labeling solely for use in connection with Dova's promotion or other commercialization of the Product in the Territory.",
		// 	"Irrevocable Or Perpetual License": "[***], Valeant hereby grants to Dova a fully paid-up, royalty free, non-transferable, non- exclusive license (with a limited right to sub-license to its Affiliates) to any Valeant Property that appears on, embodied on or contained in the Product materials or Product Labeling solely for use in connection with Dova's promotion or other commercialization of the Product in the Territory.",
		// 	"Post-Termination Services": "If this Agreement terminates or expires during a Calendar Quarter, the promotion fee payable to Valeant under Section 6.1 will be calculated only on the Net Sales that occurred during such Calendar Quarter prior to the effective date of such termination or expiration.",
		// 	"Audit Rights": "Valeant shall have the right, at its own expense, during normal business hours and upon reasonable prior notice, through certified public accounting firm or other auditor selected by Valeant and reasonably acceptable to Dova and upon execution of a confidentiality agreement reasonably satisfactory to Dova in form and substance, to inspect and audit the applicable records and books maintained by Dova for purposes of verifying Dova's payment obligations within this Agreement, including the applicable records and books of account maintained by Dova, or any Affiliate, as applicable, with respect to Net Sales in order to confirm the accuracy and completeness of such records and books of account and all payments hereunder; provided, however, that (i) such examination shall not take place more often than once per every twelve (12) months during the Term and once during the one (1) year period following the end of the Term, and (ii) such examination shall not cover a period of time that has previously been audited; provided that Valeant shall have the right to conduct additional \"for cause\" audits to the extent necessary to address significant problems relating to Dova's payment obligations hereunder.",
		// 	"Uncapped Liability": "Notwithstanding the above, the sole remedy of Dova for breach of this Section 4.1.2 shall be (i) the adjustment to the promotion fee as set forth in Section 6.1.2 and (ii) the termination right set out in Section 12.2.2.",
		// 	"Cap On Liability": "Notwithstanding the above, the sole remedy of Dova for breach of this Section 4.1.2 shall be (i) the adjustment to the promotion fee as set forth in Section 6.1.2 and (ii) the termination right set out in Section 12.2.2.",
		// 	"Liquidated Damages": "Notwithstanding the above, the sole remedy of Dova for breach of this Section 4.1.2 shall be (i) the adjustment to the promotion fee as set forth in Section 6.1.2 and (ii) the termination right set out in Section 12.2.2.",
		// 	"Insurance": "Each Party shall provide reasonable written proof of the existence of such insurance to the other Party upon request.",
		// 	"Covenant Not To Sue": "During the Term, Valeant will not contest the ownership of the Dova Trademarks and Copyrights, their validity, or the validity of any registration therefor.",
		// 	"Third Party Beneficiary": "Except as set forth in ARTICLE 11, no Person other than Dova or Valeant (and their respective Affiliates and permitted successors and assignees hereunder) shall be deemed an intended beneficiary hereunder or have any right to enforce any obligation of this Agreement."
		// 	}

		let responseJson = [
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
				"value": "(The Extremes of Good and Evil)"
			},
			{
				"category": "test 1",
				"value": "(The Extremes of Good and Evil)"
			},
			{
				"category": "test 1",
				"value": "anything embarrassing hidden in the middle of text"
			}
		]
		// const url = "https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o/uploads%2Fpredictions_.json?alt=media&token=e3fd19f9-cf55-422a-a351-91eac3633fea"
		const url = "https://firebasestorage.googleapis.com/v0/b/us-gcp-ame-its-gbhqe-sbx-1.appspot.com/o/uploads%2Fresponse.json?alt=media&token=a17ef8ae-e07a-442c-8c67-b6ed051287c8"
		responseJson[obj.index].category = obj.newCategory;
		// let str = JSON.stringify(responseJson);
		// str = str.replace('"'+obj.category+'"', obj.newCategory);
		// let data = JSON.parse(str);
		// this.fileUploadService.updateJsonFileData(url,data).subscribe(res=>{
		this.fileUploadService.updateJsonFileData(url, responseJson).subscribe(res => {
			console.log('res', res);
		})
	}

	test(url:string){
		var myHeaders = new Headers();
		// var url = 'https://firebasestorage.googleapis.com/v0/b/cuad-test/o/test.json?alt=media&token=60329772-aa78-4cb1-be28-303ca2c3216e';
		myHeaders.append("Content-Type", "application/json");
		// myHeaders.append("Authorization", "Bearer " +  MessageConstant.BEARER_TOKEN);
		var raw = JSON.stringify({
			"message": ''
		});
		var requestOptions: any = {
			method: 'GET',
			headers: myHeaders,
			mode: 'cors',
			redirect: 'follow'
		};
		fetch(url, requestOptions)
			.then(response => console.log('r1',response))
			.then(result => console.log('r2',result))
			.catch(error => console.log('r3', error));
	}
}
