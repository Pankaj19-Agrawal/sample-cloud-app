import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router  } from '@angular/router';
import { MessageConstant } from 'src/app/constants/message.constants';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private router:Router,
    private authService:AuthService,
    private commonService:CommonService
  ) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['dashboard']);
    }
  }

  login(){
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe(result=>{
        this.router.navigate(['/dashboard']);
      },
      (error:Error)=>{
        this.commonService.openSnackBar(MessageConstant.INVALID_CREDENTIALS);
      })
    }
  }

}
