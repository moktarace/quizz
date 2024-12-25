import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { Quiz, QuizQuestion } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  parseMarkdownToQuiz(markdown: string): Quiz {
    const tokens = marked.lexer(markdown);
    const quiz: Quiz = {
      title: '',
      questions: []
    };
    
    let currentQuestion: Partial<QuizQuestion> | null = null;

    tokens.forEach(token => {
      if (token.type === 'heading' && token.depth === 1) {
        quiz.title = token.text;
      } else if (token.type === 'heading' && token.depth === 2) {
        if (currentQuestion) {
          quiz.questions.push(currentQuestion as QuizQuestion);
        }
        currentQuestion = {
          question: token.text,
          options: [],
          correctAnswer: ''
        };
      } else if (token.type === 'list' && currentQuestion) {
        token.items.forEach(item=> {
          const text = item.text;
          if (text.startsWith('*')) {
            currentQuestion!.correctAnswer = text.substring(1).trim();
          }
          if (currentQuestion && currentQuestion.options) {
            currentQuestion.options.push(text.replace('*', '').trim());
          }
        });
      }
    });

    if (currentQuestion) {
      quiz.questions.push(currentQuestion as QuizQuestion);
    }

    return quiz;
  }
}