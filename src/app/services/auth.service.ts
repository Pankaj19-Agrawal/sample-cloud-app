import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  setToken(token:string):void{
    localStorage.setItem('token',token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(){
    return this.getToken();
  }

  login({username,password}:any):Observable<any>{
    if(username === 'admin' && password === 'admin'){
      this.setToken('abcdefghijklmnopqrstuvwxyz');
      return of({name:'Pankaj Agrawal', email:'pankajagrawal2@deloitte.com'});
    }
    return throwError(new Error('Failed to Login'));
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
