import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { FaceregisterComponent } from './component/faceregister/faceregister.component';
import { FaceloginComponent } from './component/facelogin/facelogin.component';
const routes: Routes = [
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent},
  {path:'',component:LoginComponent},
  {path:'webcam',component:FaceregisterComponent},
  {path:'facelogin',component:FaceloginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
