import button from '../assets/images/button.png?url';
import button2 from '../assets/images/button2.png?url';
import button3 from '../assets/images/button3.png?url';
import button4 from '../assets/images/button4.png?url';

export const quizQuestions = [
  {
    site: "789bet",
    question: "What is the capital of Japan?",
    options: [
      { text: "Seoul", isCorrect: false },
      { text: "Tokyo", isCorrect: true },
      { text: "Beijing", isCorrect: false },
      { text: "Bangkok", isCorrect: false }
    ],
    type: "single",
    category: "Geography",
    difficulty: "easy"
  },
  {
    site: "789bet",
    question: "What programming language is used to style web pages?",
    options: [
      { text: "HTML", isCorrect: false },
      { text: "JavaScript", isCorrect: false },
      { text: "CSS", isCorrect: true },
      { text: "Python", isCorrect: false }
    ],
    type: "single",
    category: "Technology",
    difficulty: "easy"
  },
  {
    site: "789bet",
    question: "Which of these are Marvel superheroes?",
    options: [
      { text: "Iron Man", isCorrect: true },
      { text: "Spider-Man", isCorrect: true },
      { text: "Batman", isCorrect: false },
      { text: "Thor", isCorrect: true }
    ],
    type: "multiple",
    category: "Entertainment",
    difficulty: "medium"
  },
  {
    site: "789bet",
    question: "What year was JavaScript created?",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    options: [
      { text: "1985", isCorrect: false },
      { text: "1995", isCorrect: true },
      { text: "2000", isCorrect: false },
      { text: "2005", isCorrect: false }
    ],
    type: "single",
    category: "Technology",
    difficulty: "hard"
  },
  {
    site: "789bet",
    question: "What does DNS stand for?",
    options: [
      { text: "Domain Name System", isCorrect: true },
      { text: "Dynamic Network Service", isCorrect: false },
      { text: "Digital Network Security", isCorrect: false },
      { text: "Data Network Storage", isCorrect: false }
    ],
    type: "single",
    category: "Technology",
    difficulty: "medium"
  },
  {
    site: "789bet",
    question: "Chọn logo chính thức của 789bet:",
    options: [
      { 
        text: "", 
        image: button,
        isCorrect: true 
      },
      { 
        text: "", 
        image: button2,
        isCorrect: false 
      },
      { 
        text: "", 
        image: button3,
        isCorrect: false 
      },
      { 
        text: "", 
        image: button4,
        isCorrect: false 
      }
    ],
    type: "image-single",
    category: "Brand",
    difficulty: "easy"
  }
];
