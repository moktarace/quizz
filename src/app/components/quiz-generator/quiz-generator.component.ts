import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from '../../services/markdown.service';
import { VideoService } from '../../services/video.service';
import { QuizSlideComponent } from '../quiz-slide/quiz-slide.component';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QuizSlideComponent],
  templateUrl : './quiz-generator.component.html',
  styleUrls: ['./quiz-generator.component.css']
})
export class QuizGeneratorComponent {

  markdownInput = `# Quiz Title
## Question 1
- Option 1
- Option 2
- *Correct Option
## Question 2
- Option 1
- Option 2
- *Correct Option`;

  backgroundUrl = '';
  questionDuration = 6;
  answerDuration = 2;
  enableSound = true;
  highlightQuestion = true;
  isLoading = false;

  quiz: Quiz | null = null;

  constructor(
    private markdownService: MarkdownService,
    private videoService: VideoService
  ) {}

  onFileChange(event: Event) {
    //Upload image file as background with the blob of the image
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Check if the file is an image
      if (typeof reader.result !== 'string') return;
      // Set the background image to the URL of the uploaded image
      this.backgroundUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    input.value = '';
  }

  removeBackground() {
    this.backgroundUrl = '';
  }

  copyToClipboard() {
    const prompt = document.getElementById('prompt') as HTMLTextAreaElement;
    prompt.select();
    document.execCommand('copy');
    alert('Copied to clipboard');
  }

  generateQuiz() {
    this.quiz = this.markdownService.parseMarkdownToQuiz(this.markdownInput);
  }

  async generateVideo() {
    if (!this.quiz) return;


    const frames: Blob[] = [];
    const slides = document.querySelectorAll('app-quiz-slide');

    for (const slide of Array.from(slides)) {
      const frame = await this.videoService.captureFrame(slide as HTMLElement);
      frames.push(frame);
    }

    this.isLoading = true;
    const video = await this.videoService.generateVideo(frames, this.questionDuration, 
      this.answerDuration, this.enableSound);
    const url = URL.createObjectURL(video);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    // Set the name of the file with the current date and the quiz title
    a.download = `${this.quiz.title}-${new Date().toISOString()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.isLoading = false;
  }
}