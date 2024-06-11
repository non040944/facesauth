import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './component/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { httpInterceptorProviders } from './_helper/http.interceptor';
import { FaceregisterComponent } from './component/faceregister/faceregister.component';
import { FaceloginComponent } from './component/facelogin/facelogin.component'; 
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FaceregisterComponent,
    FaceloginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [httpInterceptorProviders,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
