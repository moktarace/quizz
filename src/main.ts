import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { QuizGeneratorComponent } from './app/components/quiz-generator/quiz-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizGeneratorComponent],
  template: `
    <h1>TikTok Quizz Generator</h1>
    <app-quiz-generator></app-quiz-generator>
  `,
  styles: [`
    h1 {
      text-align: center;
      margin: 20px 0;
    }
  `]
})
export class App {}

bootstrapApplication(App);