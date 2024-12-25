import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '../../models/quiz.model';

@Component({
  selector: 'app-quiz-slide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-slide" [style.background-image]="'url(' + backgroundUrl + ')'" >
      <h2>{{ question.question }}</h2>
      <div class="options">
        <button
          *ngFor="let option of question.options; let i = index"
          [class.correct]="highlightCorrectAnswer && option === question.correctAnswer"
          class="option-btn"
        >
          {{i + 1}}) {{ option }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .quiz-slide {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position-x: center;
      background-position-y: center;
      color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 9/16;
    }

    h2 {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px black;
      -webkit-text-stroke-color: black;
      -webkit-text-stroke-width: thin;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      max-width: 300px;
    }

    .option-btn {
      padding: 15px;
      background: white;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .option-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .option-btn.correct {
      background: #4CAF50;
      border-color: #4CAF50;
    }
  `]
})
export class QuizSlideComponent {
  @Input() question!: QuizQuestion;
  @Input() highlightCorrectAnswer:boolean = false;
  @Input() backgroundUrl: string = '';
}