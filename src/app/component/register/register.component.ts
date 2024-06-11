import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!:FormGroup
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';


  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router ) { }
  
  ngOnInit() {
    this.initForm()
  }
  registerUser() {
    if(this.registerForm.valid){
      const fname = this.registerForm.get('fname')?.value;
      const lname = this.registerForm.get('lname')?.value;
      const phone = this.registerForm.get('phone')?.value;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
  
      const userData = {
        fname: fname,
        lname:lname,
        phone:phone,
        email: email,
        password: password
      };
      console.log(userData)
      this.authService.setdata(userData)
    }
    else{
      this.isSignUpFailed=true
    }
  }


  gotologin(){
    this.router.navigate(['/'])
  }


  initForm(){
    this.registerForm = this.fb.group({
      fname:[
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      lname:[
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      phone:[
        '',
        Validators.compose([
          Validators.required
        ])
      ],
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
      ],
      cPassword:[
        '',
        Validators.compose([
          Validators.required
        ])
      ],
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword
    }
    )
  }
}