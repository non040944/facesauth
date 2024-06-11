import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_service/auth.service';
import { StorageService } from 'src/app/_service/storage.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  haserror!:boolean;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private authService:AuthService,
    private storageService:StorageService
    ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }
  loginUser() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const userData = {
      email: email,
      password: password
    };
    console.log(typeof(email))
    this.authService.setdatalogin(userData)
    this.authService.login(userData)
      .subscribe({
        next: data=>{
          this.storageService.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['facelogin'])
        },
        error:err =>{
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      });
  }
  initForm(){
    this.loginForm = this.fb.group({
      email:[
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
        ])
      ],
      password:[
        '',
        Validators.compose([
          Validators.required,
        ])
      ]
    })
  }
  reloadPage():void{
    //window.location.reload();
    this.router.navigate(['/home'])
  }
  gotoRegister(){
    this.router.navigate(['/register'])
  }
  gotofacelogin(){
    this.router.navigate(['facelogin'])
  }
}