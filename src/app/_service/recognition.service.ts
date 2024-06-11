  import { Injectable } from '@angular/core';
  import * as faceapi from 'face-api.js';
  import { User } from '../models/user';
  import { AuthService } from './auth.service';
  import { Router } from '@angular/router';
  import { Location } from '@angular/common';

  @Injectable({
    providedIn: 'root',
  })
  export class RecognitionService {
    private maxDescriptorDistance = 0.8;
    constructor(private authservice:AuthService,private router:Router,private location:Location) {}

    private fetchImage(url: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }

    async predictImage(imageUrl: string): Promise<boolean> {
      // Load the models
      await faceapi.loadSsdMobilenetv1Model('/assets/models');
      await faceapi.loadFaceLandmarkModel('/assets/models');
      await faceapi.loadFaceRecognitionModel('/assets/models');
    
      // Fetch the user data
      const userjson = await this.authservice.getUserData();
      const user:User = JSON.parse(userjson)
      //console.log(typeof users)
      if (!user) {
        console.log('User data not available.');
        return false;
      }

      const faceid = user.faceid;
      //console.log(user.faceid)
    
      if (!faceid) {
        throw new Error(`No face detected for ${user.email}`);
      }
    
    
      // Load the image and detect the face, landmarks, and descriptor
      const img = await this.fetchImage(imageUrl);
      const myimgfullFaceDescription = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log(myimgfullFaceDescription)
      if (!myimgfullFaceDescription) {
        console.log('No face detected in the image.');
        return false;
      }
      console.log(faceid)
      console.log(myimgfullFaceDescription.descriptor)
      const distance = this.calculatedistance(faceid,myimgfullFaceDescription.descriptor)
    

    
      if (distance < this.maxDescriptorDistance) {
        return true
      } else {
        console.log('No match found.');
        return false;
      }
    }
    navigateToHome() {
      this.router.navigate(['home']).then(() => {
        // Refresh the page
        this.location.replaceState('/home');
        window.location.reload();
      });
    }
    calculatedistance(data1:any,data2:any){
      let distance = 0;
      for(let i = 0; i < data1.length; i++){
        distance+=Math.pow(data1[i]-data2[i],2)
      }
      return Math.sqrt(distance)
    }
  }  
