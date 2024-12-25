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
  markdownInput = ''
  backgroundUrl = '';
  quiz: Quiz | null = null;

  constructor(
    private markdownService: MarkdownService,
    private videoService: VideoService
  ) {}

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

    const video = await this.videoService.generateVideo(frames);
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
  }
}