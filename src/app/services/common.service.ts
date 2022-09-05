import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IfileContentJson } from 'src/app/models/fileContentJson.model'; 

@Injectable({ providedIn: 'root' })

export class CommonService {
    fileContent: string;
    fileContentJson: IfileContentJson;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
	verticalPosition: MatSnackBarVerticalPosition = 'top';
    
    constructor(private snackBar: MatSnackBar) { }

    getFileContent(){
        return this.fileContent = 'automobile, byname auto, also called motorcar or car, a usually four-wheeled vehicle designed primarily for passenger transportation and commonly propelled by an internal-combustion engine using a volatile fuel. Computer Science is the study of computers and computational systems. Unlike electrical and computer engineers, computer scientists deal mostly with software and software systems; this includes their theory, design, development, and application';
    }

    setFileContentJson(data:IfileContentJson){
        this.fileContentJson = data;
    }

    getFileContentJson(){
        return this.fileContentJson;
    }

    //toast message
	openSnackBar(message:string) {
		this.snackBar.open(message, '', {
      		horizontalPosition: this.horizontalPosition,
      		verticalPosition: this.verticalPosition,
	  		duration: 3000
    	});
	}
}