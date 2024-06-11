import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { data } from '@tensorflow/tfjs';
import { UserService } from './user.service';
import { response } from 'express';
import { Router } from '@angular/router';


const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public data1:any
  public data2:any
  public datalogin:any
  constructor(private http:HttpClient,private userservice:UserService,private router:Router) { }
  
  login(userdata:any):Observable<any>{
    const {email,password} = userdata
    console.log(email)
    return this.http.post(AUTH_API+'signin',
    {
      email,
      password
    },
    httpOptions
    );
  }
  register(): Observable<any> {
    const { fname, lname,phone, email, password } = this.data1;
    const facedata = this.data2;
    //console.log(this.data1)
    // console.log(facedata)
    return this.http.post(
      AUTH_API + 'signup',
      {
        fname,
        lname,
        phone,
        email,
        password,
        facedata
      },
      httpOptions
    );
    
  }
  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }
  

  //**************************************************** */
  setdata(userData:any){
    const { fname, lname, phone, email, password } =userData
    return this.http.post(
      AUTH_API + 'checksignup',
      {
        email
      },
      httpOptions
    ).subscribe(
      (response:any)=>{
        this.data1=userData;
        console.log(this.data1)
        this.router.navigate(['webcam'])
      },
      (error:any)=>{
        window.alert("error")
      }
    )
  }
  setdata2(userData:any){
    this.data2=userData
  }

  setdatalogin(userData:any){
    this.datalogin=userData
  }
  show(){
    //console.log(this.data1)
    //console.log(this.data2)
  }
  getUserData(): Promise<any> {
    return  new Promise((resolve, reject) => {
      const userData = this.datalogin;
      console.log(userData)
      //console.log(userData);
      this.userservice.getUserBoard(userData).subscribe(
        (response) => {
          //console.log(response); // Log the entire response object
          // Resolve the promise with the user data
          resolve(response);
        },
        (error) => {
          // Reject the promise with the error
          reject(error);
        }
      );
    });
  }
  
  
}
