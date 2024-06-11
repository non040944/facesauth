import { Component,ViewChild,ElementRef,OnInit,OnDestroy } from '@angular/core';
import { nets, detectAllFaces, TinyFaceDetectorOptions, resizeResults, createCanvasFromMedia, draw } from 'face-api.js';
import * as faceapi from 'face-api.js'
import { matchDimensions as matchCanvasDimensions } from 'face-api.js';
import * as  tf   from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl';
import { RecognitionService } from 'src/app/_service/recognition.service';
import { AuthService } from 'src/app/_service/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
//import { RecognitionService } from 'src/app/_service/recognition.service';

@Component({
  selector: 'app-faceregister',
  templateUrl: './faceregister.component.html',
  styleUrls: ['./faceregister.component.css']
})
export class FaceregisterComponent implements OnInit{

WIDTH = 600;
HEIGHT = 480;
@ViewChild('video',{ static: true })
public video?: ElementRef;
@ViewChild('canvas',{ static: true })
public canvasRef?: ElementRef;
constructor(private elRef: ElementRef,private recognitionService:RecognitionService,private authService:AuthService,private router:Router,private location:Location) {}
stream: any;
detection: any;
resizedDetections: any;
canvas: any;
canvasEl: any;
displaySize: any;
videoInput: any;
capturedImageSrc: string = '';
frameSize: any = {
  width: 250,
  height: 250,
};
framePosition: any = {
  x: 200,
  y: 150,
};

async ngOnInit() {
  Promise.all([
  nets.tinyFaceDetector.loadFromUri('/assets/models'),
  nets.faceLandmark68Net.loadFromUri('/assets/models'),
  nets.faceRecognitionNet.loadFromUri('/assets/models'),
  nets.faceExpressionNet.loadFromUri('/assets/models')])
  .then(() => this.startVideo());
  
  }

startVideo() {
    tf.setBackend('webgl');
    this.videoInput = this.video?.nativeElement;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.videoInput.srcObject = stream;
        this.stream = stream;
      })
      .catch((err) => console.log(err));
      //this.recofintionService.detectFace()
    this.detectFaces();
}
async detectFaces() {
  this.elRef.nativeElement.querySelector('video').addEventListener('play', () => {
    this.canvas = createCanvasFromMedia(this.videoInput);
    this.canvasEl = this.canvasRef?.nativeElement;
    this.canvasEl.appendChild(this.canvas);
    this.canvas.setAttribute('id', 'canvass');
    this.canvas.setAttribute(
      'style',`position: fixed;
      top: 0;
      left: 400;`
    );
    this.displaySize = {
      width: this.videoInput.width,
      height: this.videoInput.height,
    };
    matchCanvasDimensions(this.canvas, this.displaySize);

    let isFaceDetected = false; // Flag to track if a face is detected

    setInterval(async () => {
      this.detection = await detectAllFaces(this.videoInput, new TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      this.resizedDetections = resizeResults(this.detection, this.displaySize);

      // Clear canvas
      const context = this.canvas.getContext('2d');
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw frame box
      context.lineWidth = 2;
      context.strokeStyle = 'blue';
      context.beginPath();
      context.rect(this.framePosition.x, this.framePosition.y, this.frameSize.width, this.frameSize.height);
      context.stroke();

      // Draw detections
      // draw.drawDetections(this.canvas, this.resizedDetections);
      // draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
      // draw.drawFaceExpressions(this.canvas, this.resizedDetections);


      if (this.detection.length > 0 && !isFaceDetected) {
        const isFaceInFrame = this.isFaceInFrame();
        if(isFaceInFrame){
          const capturedImage = await this.captureImage();
          this.authService.setdata2(capturedImage)
          isFaceDetected = true;
          this.authService.register().subscribe({
              next:async data =>{
                await window.alert("register success")
                this.router.navigate(['/']).then(() => {
                  // Refresh the page
                  this.location.replaceState('/');
                  window.location.reload();
                });
              }
            })
          //this.router.navigate(['/'])
        }

      } else if (this.detection.length === 0 && isFaceDetected) {
        this.capturedImageSrc = ''; // Reset the captured image URL
        isFaceDetected = false;
      }
    }, 100);
  });
}

async captureImage():Promise<Float32Array> {
  const captureCanvas = document.createElement('canvas');
  captureCanvas.width = this.videoInput.videoWidth;
  captureCanvas.height = this.videoInput.videoHeight;
  const ctx = captureCanvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(this.videoInput, 0, 0, captureCanvas.width, captureCanvas.height);
  } else {
    throw new Error('Failed to get canvas context.');
  }

  const capturedImageSrc = captureCanvas.toDataURL();
  const img0 = await this.fetchImage(capturedImageSrc);
    
  const fullFaceDescription =  await faceapi
    .detectSingleFace(img0)
    .withFaceLandmarks()
    .withFaceDescriptor();
    if (fullFaceDescription) {
      console.log(fullFaceDescription.descriptor)
      return fullFaceDescription.descriptor;
    } else {
      throw new Error('Failed to detect a face.');
    }
}

isFaceInFrame(): boolean {
  const faceBox = this.resizedDetections[0].detection.box;
  const frameLeft = this.framePosition.x;
  const frameTop = this.framePosition.y;
  const frameRight = frameLeft + this.frameSize.width;
  const frameBottom = frameTop + this.frameSize.height;

  const faceLeft = faceBox.x;
  const faceTop = faceBox.y;
  const faceRight = faceBox.x + faceBox.width;
  const faceBottom = faceBox.y + faceBox.height;

  return (
    faceLeft >= frameLeft &&
    faceTop >= frameTop &&
    faceRight <= frameRight &&
    faceBottom <= frameBottom
  );
}

async fetchImage(url: string): Promise<HTMLImageElement> {
   await faceapi.loadSsdMobilenetv1Model('/assets/models');
   await faceapi.loadFaceLandmarkModel('/assets/models');
   await faceapi.loadFaceRecognitionModel('/assets/models');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}



}
