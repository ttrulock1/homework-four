	//application settings
  const timePerQuestion = 10; //seconds
  const wrongAnswerPenalty = 5; //seconds
  const rightAnswerReward = 10; //points
const storageName = "quiz";
  const maxNumberOfHighScores = 10;

  //set up global/application variables
  let score = 0;
  let currentQuestionIndex = 0;
  let timeRemaining;
  let timer;
let initials = "";

  //wait for all HTML to load
document.addEventListener("DOMContentLoaded", init);

  //actions to be performed once on page load
  function init(){
document.querySelector("footer input").addEventListener("keyup", initialsEntered);
    document.querySelector("footer button").addEventListener("click", startGame);
showHighScores();
  }

  //actions to be performed when game starts
  function startGame(){
    //set score to zero
      score = 0;
      //set currentquestionIndex to zero (so we can start with first question)
      currentQuestionIndex = 0;
      //start timer
      startTimer();
      //add "quiz" class to <body>
      document.body.classList.add("quiz");
      //load first question
      loadQuestion();
  }

  //actions to be performed for each question
  function loadQuestion(){
    let currentQuestion = questions[currentQuestionIndex]; //when currentQuestionIndex is zero, currentQuestion is the first question in array
      let possibleAnswers = shuffle(currentQuestion.a); //new randomized array of possible answers...does not mess up original array
      //backticks (``) or template literal strings allow us to combine strings and variables
      let html = `<h2>${currentQuestion.q}</h2>`;
      for (let possibleAnswer of possibleAnswers){
        html += `<button>${possibleAnswer}</button>`;
      }
      //now we have custom HTML for the question and answer; put it into the <main>
      document.querySelector("main").innerHTML = html;
      //now we have buttons...let's listen for clicks on them
      let buttons = document.querySelectorAll("main button");
      for (let button of buttons){
        button.addEventListener("click", handleUserClick);
      }
  }

  //actions to be performed when user selects an answer
  function handleUserClick(e){
      //e is the click event object, a collection of data about the click
      //e.target is the button that was clicked on
      //e.target.textContent is the text in the button that was clicked on
    let userSelection = e.target.textContent;
      let correctAnswer = questions[currentQuestionIndex].a[0]; //first answer in data is always the correct one!
      if (userSelection === correctAnswer){
        //correct! :D
          //reward score
          score += rightAnswerReward;
      }
      else {
        //incorrect :<
          //penalize time
          timeRemaining = Math.max(0, timeRemaining - wrongAnswerPenalty); //do not allow negative time
      }
      //advance to next question
      currentQuestionIndex++;
      //are we finished?
      if (currentQuestionIndex >= questions.length){
        //game over
          endTimer();
          endGame();
      }
      else { //game not over
        loadQuestion();
      }
  }

  //actions to be performed when quiz is finished
  function endGame(){
    //get time remaining + score
score += timeRemaining;
      //display score
      document.querySelector("footer h3").textContent = `Your score is ${score}`;
      //add score to high scores
      let highScores = getHighScores();
      highScores.push({score, initials});
      setHighScores(highScores);
      showHighScores();
//remove "quiz" class from <body>
      document.body.classList.remove("quiz");
  }

  //timer functions
  function startTimer(){
    //calculate starting time
      timeRemaining = timePerQuestion * questions.length; //3 questions -> 30 seconds on clock
      //start clock
      tick(); //call tick first to show starting timeRemaining
      timer = setInterval(tick, 1000);
  }
  function endTimer(){
    clearInterval(timer);
  }
  function tick(){
    document.querySelector("header time").textContent = timeRemaining;
      if (timeRemaining <= 0) { //if we run out of time, stop timer
         endTimer();
          endGame();
      }
      else timeRemaining--; //else decrement time remaining
  }

  //high score functions
function initialsEntered(e){
      //e is the event object
      //e.target is the <input>
      //e.target.value is the text in the <input>
      //e.target.value.trim() removes whitespace from the beginning and end of the text in the <input>
initials = e.target.value.trim();
if (initials.length){
  document.querySelector("footer button").removeAttribute("disabled");
}
else {
  document.querySelector("footer button").setAttribute("disabled", true);
}
}
function getHighScores(){
let highScores = localStorage.getItem(storageName);
if (!highScores) return [];
return JSON.parse(highScores);
}
function setHighScores(highScores){
      //sort high scores
      highScores.sort((a,b) => b.score - a.score); //sort highest to lowest (descending)
      //limit number of high scores
      highScores = highScores.slice(0, maxNumberOfHighScores); //shortens highScores, if necessary
      //save to local storage
localStorage.setItem(storageName, JSON.stringify(highScores));
}
function showHighScores(){
let highScores = getHighScores();
let html = "";
if (!highScores.length){
  html = "<li>No scores yet</li>";
}
else {
  for (let {initials, score} of highScores){
    html += `<li>${score}: ${initials}</li>`;
  }
}
document.querySelector("footer ol").innerHTML = html;
}

  //data (also global)
  const questions = [
      {
        q: "Who was the gutarist in Black Sabbath?",
          a: [
            "Tony Iommi", "George Harrison", "Jimmy Page", "Slash"
          ]
      },
      {
        q: "What guitarist replaced Brian Jones in the Rolling Stones?",
          a: [
            "Mick Taylor", "Robbie Robertson", "Eric Clapton", "Ron Wood"
          ]
      },
      {
        q: "What guitarist did Jimi Hendrix actually say was his favorite guitarist?",
          a: [
            "Billy Gibbons", "Roland Bautista", "Eric Clapton", "Terry Kath"
          ]
      },
      {
        q: "What musician never played as a guitarist in Metallica?",
          a: [
            "Randy Rhodes", "Dave Mustaine", "James Hetfield", "Kirk Hammitt"
          ]
      },
    {
        q: "Which guitarist never played in a punk band?",
          a: [
            "Luther Perkins", "Raymond Pepperall", "Greg Ginn", "Paul Caiafa"
          ]
      },
      {
        q: "Who wasn't one of the primary guitarist of CSNY?",
          a: [
            "Stephen Stills", "Neil Young", "David Crosby", "Graham Nash"
          ]
      },
      {
        q: "What guitarist came to tour with Ozzy Osborne in the early 80s?",
          a: [
            "Randy Rhodes", "Robbie Roberston", "Ronnie Wood", "Robin Finck"
          ]
      },
      {
        q: "Which Ramone was the play guitar for the Ramones?",
          a: [
            "DiDi Ramone", "Joey Ramone", "Tommy Ramone", "Mickey Ramone"
          ]
      },
      {
        q: "What widley acclaimed guitarist is still alive as of 2021?",
          a: [
            "Slash", "Jerry Garcia", "Jimi Hendrix", "George Harrison"
          ]
      },
      {
        q: "What guitarist never played with a 'jam band?' ",
          a: [
            "The Edge", "Jerry Garcia", "John Mayer", "Hunter Brown"
          ]
      },

  ];

  //helper functions
  //rearranges an array randomly without changing original array
  function shuffle(arr){
    let clone = JSON.parse(JSON.stringify(arr));
      return clone.sort((a,b) => Math.random() - 0.5);
  }