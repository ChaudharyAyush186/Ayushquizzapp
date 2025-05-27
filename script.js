const quizQuestions = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: "Pacific Ocean"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: "Leonardo da Vinci"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: "Au"
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correctAnswer: "Australia"
    }
];

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('timer');
const highScoreAlert = document.getElementById('high-score-alert');

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let answeredQuestions = 0;
let timerInterval;
let timeLeft = 15;
let shuffledQuestions = [];

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextButton);
restartBtn.addEventListener('click', restartQuiz);

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    shuffledQuestions = shuffleArray(quizQuestions);
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = 0;
    loadQuestion();
    updateProgressBar();
    updateScore();
}

function loadQuestion() {
    resetState();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${shuffledQuestions.length}`;
    currentQuestion.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option', 'border-2', 'border-gray-200', 'p-4', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-50');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(optionElement, option));
        optionsContainer.appendChild(optionElement);
    });
    nextBtn.textContent = 'Submit Answer';
    nextBtn.disabled = true;
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerElement.style.width = '100%';
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.style.width = `${(timeLeft / 15) * 100}%`;
        if (timeLeft <= 5) {
            timerElement.classList.remove('bg-indigo-500');
            timerElement.classList.add('bg-red-500');
        } else {
            timerElement.classList.remove('bg-red-500');
            timerElement.classList.add('bg-indigo-500');
        }
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    const options = document.querySelectorAll('.option');
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    options.forEach(option => {
        option.classList.remove('selected');
        if (option.textContent === currentQuestion.correctAnswer) {
            option.classList.add('correct');
        }
        option.classList.add('pointer-events-none');
    });
    nextBtn.textContent = currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results';
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    answeredQuestions++;
}

function selectOption(optionElement, selectedAnswer) {
    clearInterval(timerInterval);
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
        option.classList.add('pointer-events-none');
    });
    optionElement.classList.add('selected');
    selectedOption = selectedAnswer;
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
        optionElement.classList.add('correct');
        score++;
        updateScore();
    } else {
        optionElement.classList.add('incorrect');
        options.forEach(option => {
            if (option.textContent === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
        });
    }
    nextBtn.textContent = currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results';
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    answeredQuestions++;
}

function handleNextButton() {
    clearInterval(timerInterval);
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        updateProgressBar();
    } else {
        showResults();
    }
}

function updateProgressBar() {
    const progressPercentage = (currentQuestionIndex / shuffledQuestions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function resetState() {
    selectedOption = null;
    optionsContainer.innerHTML = '';
    nextBtn.disabled = true;
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
}

function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScore.textContent = `${score}/${shuffledQuestions.length}`;
    if (score === shuffledQuestions.length) {
        scoreMessage.textContent = "Perfect score! You're a genius!";
    } else if (score >= shuffledQuestions.length * 0.8) {
        scoreMessage.textContent = "Great job! You know your stuff!";
    } else if (score >= shuffledQuestions.length * 0.6) {
        scoreMessage.textContent = "Good effort! Keep learning!";
    } else if (score >= shuffledQuestions.length * 0.4) {
        scoreMessage.textContent = "Not bad, but you can do better!";
    } else {
        scoreMessage.textContent = "Keep practicing to improve your score!";
    }
    const highScore = localStorage.getItem('quizHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
        highScoreAlert.classList.remove('hidden');
    } else {
        highScoreAlert.classList.add('hidden');
    }
}

function restartQuiz() {
    resultsScreen.classList.add('hidden');
    startQuiz();
          }
