import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import etro from "etro";


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  // Define duration constant
  QUESTION_DURATION = 5;
  ANSWER_DURATION = 4;
  TRANSITION_DURATION = 1;
  PROGRESS_BAR_HEIGHT = 10;
  PROGRESS_BAR_COLOR = "#4CAF50";
  PROGRESS_BAR_SPEED = 0.1;

  async captureFrame(element: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true
    });
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob!);
      }, 'image/png');
    });
  }

  async generateVideo(frames: Blob[]) {
    // generate a video from the frames with etro
    const canvas = document.createElement("canvas");
    // Set the canvas size to the size of the first frame 
    const image = new Image();
    image.src = URL.createObjectURL(frames[0]);
    // Wait for the image to load
    await new Promise(resolve => {
      image.onload = resolve;
    });
    canvas.width = image.width;
    canvas.height = image.height;
    document.body.appendChild(canvas);

    // Create a new movie
    const movie =  new etro.Movie({canvas});

    let startTime = 0;
    let duration = this.QUESTION_DURATION;
    
    // Add frames to the video
    for (const frame of frames) {
      const layer = new etro.layer.Image({
        source: URL.createObjectURL(frame),
        startTime : startTime,
        duration: duration
      });
      movie.layers.push(layer);
      
      // Add a progress bar on the top of the screen
      for (let i = 0; i <= duration + 1; i += this.PROGRESS_BAR_SPEED) {
        const loading = new etro.layer.Visual({
          startTime: startTime + i,
          duration: this.PROGRESS_BAR_SPEED,
          width: (i * canvas.width) / duration,
          height: this.PROGRESS_BAR_HEIGHT,
          background: etro.parseColor(this.PROGRESS_BAR_COLOR)
        });
        movie.layers.push(loading);
      }

      startTime += duration;
      duration = duration === this.QUESTION_DURATION ? 
        this.ANSWER_DURATION 
        : this.QUESTION_DURATION;
    }

    return movie
    .record({
      frameRate: 30,
    })
    .then((blob) => {
      document.body.removeChild(canvas);
      return blob;
    });
  }

}