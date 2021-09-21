	//application settings
    const timePerQuestion = 10; //seconds
    const wrongAnswerPenalty = 5; //seconds
    const rightAnswerReward = 10; //points

    //set up global/application variables
    let score = 0;
    let currentQuestionIndex = 0;
    let timeRemaining;
    let timer;

    //wait for all HTML to load
    document.addEventListener("DOMContentLoaded", init);

    //actions to be performed once on page load
    function init(){
      document.querySelector("footer button").addEventListener("click", startGame);
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
        let html = `
          <h2>${currentQuestion.q}</h2>
          <ul>
      `;
        for (let possibleAnswer of possibleAnswers){
          html += `<button>${possibleAnswer}</button>`;
      }
        html += `</ul>`;
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

    //data (also global)
    const questions = [
      {
          q: "Q1",
            a: [
              "correct", "incorrect", "incorrect", "incorrect"
          ]
      },
      {
          q: "Q2",
            a: [
              "correct", "incorrect", "incorrect", "incorrect"
          ]
      },
    {
          q: "Q3",
            a: [
              "correct", "incorrect", "incorrect", "incorrect"
          ]
      },
  ];

    //helper functions
    //rearranges an array randomly without changing original array
    function shuffle(arr){
      let clone = JSON.parse(JSON.stringify(arr));
        let shuffled = [];
        while (clone.length){
          let randIndex = Math.floor(Math.random() * clone.length);
            let [element] = clone.splice(randIndex, 1);
            shuffled.push(element);
      }
        return shuffled;
  }