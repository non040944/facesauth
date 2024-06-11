import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/_service/storage.service';
import { AuthService } from 'src/app/_service/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_service/user.service';
import { User } from 'src/app/models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  a: any;
  user?: User;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private userservice: UserService,
    private datePipe:DatePipe
  ) {}

  ngOnInit(): void {
    this.a = this.storageService.getUser();
    console.log(this.a);

    this.userservice.getUserBoard(this.a).subscribe(
      data => {
        this.currentUser = data;
        this.user = JSON.parse(this.currentUser) as User;
        console.log((this.user.loginTime))
        // Convert loginTime objects to Date objects
      if (Array.isArray(this.user.loginTime)) {
        this.user.loginTime = this.user.loginTime.map((time: any) => {
          const seconds = time._seconds;
          const nanoseconds = time._nanoseconds;
          return new Date(seconds * 1000 + nanoseconds / 1000000);
        });
      }
      },
      error => {
        console.log(error);
        // Handle any errors that occur during the request
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
