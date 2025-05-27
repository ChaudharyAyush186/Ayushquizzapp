    // Quiz questions
    const quizQuestions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: "Paris"
        },
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
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: "William Shakespeare"
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: "Au"
        }
    ];

    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const reviewScreen = document.getElementById('review-screen');
    
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const viewAnswersBtn = document.getElementById('view-answers-btn');
    const backToResultsBtn = document.getElementById('back-to-results-btn');
    
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const maxScoreElement = document.getElementById('max-score');
    const scoreMessageElement = document.getElementById('score-message');
    const progressBar = document.getElementById('progress-bar');
    const timerElement = document.getElementById('timer');
    const timerBar = document.getElementById('timer-bar');
    const feedbackElement = document.getElementById('feedback');
    const answersContainer = document.getElementById('answers-container');

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let answeredQuestions = [];
    let shuffledQuestions = [];
    let timerInterval;
    let timeLeft = 15;

    // Initialize the quiz
    function initQuiz() {
        // Shuffle questions
        shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
        
        // Reset state
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        answeredQuestions = [];
        
        // Update UI elements
        totalQuestionsElement.textContent = shuffledQuestions.length;
        scoreElement.textContent = score;
        maxScoreElement.textContent = shuffledQuestions.length;
        
        // Load first question
        loadQuestion();
    }

    // Load a question
    function loadQuestion() {
        const question = shuffledQuestions[currentQuestionIndex];
        
        // Update question number and progress bar
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        const progressPercentage = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Display question
        questionElement.textContent = question.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn w-full text-left p-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all';
            optionBtn.innerHTML = `
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 mr-3 text-sm font-medium">
                    ${String.fromCharCode(65 + index)}
                </span>
                ${option}
            `;
            
            optionBtn.addEventListener('click', () => selectOption(optionBtn, option));
            optionsContainer.appendChild(optionBtn);
        });
        
        // Reset UI state for new question
        nextBtn.textContent = 'Submit Answer';
        nextBtn.disabled = true;
        selectedOption = null;
        feedbackElement.classList.add('hidden');
        
        // Start timer
        resetTimer();
    }

    // Select an option
    function selectOption(optionBtn, option) {
        // Clear previous selection
        const options = document.querySelectorAll('.option-btn');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Mark as selected
        optionBtn.classList.add('selected');
        selectedOption = option;
        
        // Enable next button
        nextBtn.disabled = false;
    }

    // Check answer
    function checkAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        
        // Store answer data
        answeredQuestions.push({
            question: currentQuestion.question,
            selectedAnswer: selectedOption,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: isCorrect
        });
        
        // Update score if correct
        if (isCorrect) {
            score++;
            scoreElement.textContent = score;
            feedbackElement.textContent = "Correct!";
            feedbackElement.className = "text-sm font-medium text-green-600";
        } else {
            feedbackElement.textContent = "Incorrect!";
            feedbackElement.className = "text-sm font-medium text-red-600";
        }
        feedbackElement.classList.remove('hidden');
        
        // Show correct/incorrect styling
        const options = document.querySelectorAll('.option-btn');
        options.forEach(opt => {
            const optionText = opt.textContent.trim().substring(1).trim();
            
            if (optionText === currentQuestion.correctAnswer) {
                opt.classList.add('correct');
            } else if (opt.classList.contains('selected')) {
                opt.classList.add('incorrect');
            }
            
            // Disable all options
            opt.disabled = true;
        });
        
        // Change button text
        nextBtn.textContent = currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results';
        
        // Clear timer
        clearInterval(timerInterval);
    }

    // Move to next question or end quiz
    function nextQuestion() {
        if (nextBtn.textContent === 'Submit Answer') {
            checkAnswer();
            return;
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < shuffledQuestions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    // Show results screen
    function showResults() {
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        finalScoreElement.textContent = score;
        
        // Set score message
        const percentage = (score / shuffledQuestions.length) * 100;
        let message;
        
        if (percentage === 100) {
            message = "Perfect score! You're a genius!";
        } else if (percentage >= 80) {
            message = "Excellent work! You really know your stuff!";
        } else if (percentage >= 60) {
            message = "Good job! You have solid knowledge.";
        } else if (percentage >= 40) {
            message = "Not bad! Keep learning and try again.";
        } else {
            message = "Keep practicing! You'll improve next time.";
        }
        
        scoreMessageElement.textContent = message;
        
        // Save high score to localStorage
        saveHighScore(score);
    }

    // Show answer review
    function showAnswerReview() {
        resultsScreen.classList.add('hidden');
        reviewScreen.classList.remove('hidden');
        
        // Clear previous content
        answersContainer.innerHTML = '';
        
        // Add each question and answer
        answeredQuestions.forEach((item, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'border-b border-gray-200 pb-4 last:border-0';
            
            const questionNumber = document.createElement('div');
            questionNumber.className = 'text-sm font-medium text-gray-500 mb-2';
            questionNumber.textContent = `Question ${index + 1}`;
            
            const questionText = document.createElement('div');
            questionText.className = 'text-gray-800 font-medium mb-3';
            questionText.textContent = item.question;
            
            const answerStatus = document.createElement('div');
            answerStatus.className = `text-sm font-medium mb-2 ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`;
            answerStatus.textContent = item.isCorrect ? '✓ Correct' : '✗ Incorrect';
            
            const yourAnswer = document.createElement('div');
            yourAnswer.className = 'text-sm text-gray-600 mb-1';
            yourAnswer.innerHTML = `<span class="font-medium">Your answer:</span> ${item.selectedAnswer}`;
            
            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'text-sm text-gray-600';
            correctAnswer.innerHTML = `<span class="font-medium">Correct answer:</span> ${item.correctAnswer}`;
            
            answerDiv.appendChild(questionNumber);
            answerDiv.appendChild(questionText);
            answerDiv.appendChild(answerStatus);
            answerDiv.appendChild(yourAnswer);
            
            if (!item.isCorrect) {
                answerDiv.appendChild(correctAnswer);
            }
            
            answersContainer.appendChild(answerDiv);
        });
    }

    // Timer functions
    function startTimer() {
        timeLeft = 15;
        timerElement.textContent = timeLeft;
        timerBar.style.width = '100%';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            timerBar.style.width = `${(timeLeft / 15) * 100}%`;
            
            if (timeLeft <= 5) {
                timerBar.classList.remove('bg-indigo-600');
                timerBar.classList.add('bg-red-500');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (!selectedOption) {
                    // Auto-select nothing and move on
                    selectedOption = "No answer";
                    checkAnswer();
                    nextBtn.textContent = currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results';
                }
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerBar.classList.remove('bg-red-500');
        timerBar.classList.add('bg-indigo-600');
        startTimer();
    }

    // High score functions
    function saveHighScore(score) {
        const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');
        highScores.push({
            score: score,
            maxScore: shuffledQuestions.length,
            date: new Date().toISOString()
        });
        
        // Sort by score (highest first)
        highScores.sort((a, b) => b.score - a.score);
        
        // Keep only top 5
        const topScores = highScores.slice(0, 5);
        
        localStorage.setItem('quizHighScores', JSON.stringify(topScores));
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        initQuiz();
    });

    nextBtn.addEventListener('click', nextQuestion);

    playAgainBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        initQuiz();
    });

    viewAnswersBtn.addEventListener('click', showAnswerReview);

    backToResultsBtn.addEventListener('click', () => {
        reviewScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
    });
