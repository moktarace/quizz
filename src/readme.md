I've created an Angular application that can generate TikTok-style quiz videos from markdown content. Here's how to use it:

1.  The markdown format should follow this structure:

```
# Quiz Title

## Question 1
- Option 1
- Option 2
- *Correct Option

```

Example of chatgpt prompt for generating quiz content:

```
Genere moi un quizz sur le cinema de Nolan en respectant ce format markdown : 

# Quiz Title

## Question content
- Option 1
- Option 2
- *Correct Option

Je ne veux que le quizz en reponse et la bonne reponse n'apparait qu'une fois. Les questions seront affichées pendant cinq secondes et les réponses pendant trois secondes. Je veux que le quizz soit en format vertical pour TikTok et que la video dure 50 secondes. 
```

2.  The application includes:
    
    -   A markdown parser service that converts markdown to quiz format
    -   A video service that captures frames and generates video
    -   A quiz slide component for rendering questions
    -   A main quiz generator component that handles the workflow
3.  Features:
    
    -   Live preview of quiz slides
    -   TikTok-style vertical video format (9:16 aspect ratio)
    -   Visual indication of correct answers
    -   Video generation (currently outputs frames as images)

Note: For a full production version, you'd want to add:

-   A proper video encoding solution using WebCodecs API
-   Transition animations between slides
-   Background music and sound effects
-   More styling options and themes
-   Error handling and validation

The development server is now running and you can test the application. Paste your markdown quiz content into the textarea and click "Generate Quiz" to see the preview.