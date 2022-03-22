//https://www.w3schools.com/js/js_random.asp, https://www.codegrepper.com/code-examples/javascript/how+to+append+empty+array+in+javascript, https://www.w3schools.com/howto/howto_js_rangeslider.asp, https://www.w3schools.com/cssref/default.asp (used for finding random things), https://stackoverflow.com/questions/4015345/how-do-i-properly-escape-quotes-inside-html-attributes, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range, https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs, https://stackoverflow.com/questions/15189857/what-is-the-most-efficient-way-to-empty-a-plain-object-in-javascript, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs, https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l, https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in, https://www.w3schools.com/css/css_border.asp,https://www.w3schools.com/jsref/jsref_now.asp, https://www.w3schools.com/cssref/tryit.asp?filename=trycss_position2, https://www.w3schools.com/cssref/pr_class_position.asp, https://www.w3schools.com/js/js_cookies.asp, https://www.youtube.com/watch?v=YUdc2szWz8Q

/*
What I have had issues with: 
CSS - dont remember what specifically but i do remember coming into problems with it
fixing the glitches that came with it
*/

//"nameofrange".value = number I want

// const keyBoard = document.querySelector("body");

// print(keyBoard);
// keyBoard.addEventListener("keydown", (e) => {
//   console.log(e);
// });

var pattern = []; //array contain the pattern for that round
var clueInProgress = false; //is a clue playing right now
var progress = 0; //Score of the player
var gamePlaying = false; //Has a game started
var tonePlaying = false; //is a tone playing?
var guessCounter = 0; //
var validGuessTime; //contains the time the player should guess
var strikes; //how much times the player guessed wrong

var gameSettings = {
  //the configuration object
  patternLength: 5,
  // countDownTimer: 3,
  // countDownTimerIncrement: 1.5,
  // clueHoldTime: 8,
  volume: 5,
  lives: 3,
  buttonAmount: 5,
  timePerButton: 4,
  speedDecay:0.85,
  timeDecay: 0,
};

var userGameSettings = Object.assign({}, gameSettings); //clones gameSettings, UserGS is used in for the settings screen and if the user presses apply, it runs the function that applies it

// loadCookie();

// applySettings("Loaded Previous Save")

// gameSettings["buttonAmount"] = 2;

function updateScreen() {
  //updates livesPplaceholder
  //update timerPlaceholder
  //update buttons
  //everything that updates on the screen should be called through here
}

var freqMap;

applySettings();

// function updateScreen(){
//   update buttons, update lives time and progress,
// }
updateFreqMap(gameSettings["buttonAmount"]);

document.getElementById("livesPlaceholder").innerText = gameSettings["lives"];

/* 
TODO: fix glitch dragging mouse away from screen causes sounds to continue until any button is pressed
TODO: fix: spamming start stop adds a bunch to the timeline and will force sound to play no matter what
TODO: connect to a data base to read highscores and allow the user submit their own score, only if the default values are not changed
*/
/*


*/
/*
TODO: implement pression number keys to also press buttons
TODO: allow user to change game speed
TODO: change button size
TODO: make it known to the user when they can guess
TODO: Connect cookies with slider info
TODO: Add Infinity to settings page
TODO: Connect Time Left

*/

function print(q) {
  //if i accidentally put print it wont run an error
  console.log(q);
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime); //magic
o.connect(g);
o.start(0);

var clueHoldTime = 1000; //how long each clue is played for
var cluePauseTime = 333; //how long to pause between clues
var nextClueWaitTime = 1000; //how long to wait before next list of clues starts

function timer(clueLength) {
  // called by playClueSequence, sets validGuessTime to the time the player should guess the pattern, TODO: Change to using setTimeout
  //if I had more time I would use setTimeout but I want to work on other features
  let howLong = nextClueWaitTime; //
  howLong += (clueLength + 1) * (cluePauseTime + clueHoldTime) - 100; //for every clue add cPT and cHT to find out how long the clue plays for
  setTimeout(function () {
    console.log("Play now");
  }, howLong);

  validGuessTime = Date.now() + howLong; //gives the time the user should press
  console.log(`Player should press after ${validGuessTime / 1000} s`); //logs it
}

function startGame() {
  //called by HTML start button, if settings is hidden, it resets strikes pattern clueHoldTime cluePauseTime HTML element livesPlaceholder progress, sets gamePlaying to true and hides swap button and remove hide from stop button, calls playClueSequence

  if (document.getElementById("settingsContainer").classList == "hidden") {
    strikes = 0;
    pattern = [];
    clueHoldTime = 1000; //how long each clue is played for
    cluePauseTime = 333; //how long to pause between clues
    document.getElementById("livesPlaceholder").innerText =
      gameSettings["lives"]; //updates the lives on the html
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");

    playClueSequence();
    showMessage("Game Started");
  }
}

function stopGame() {
  //setts gamePlaying to false, swaps hide from start button to stop buttons
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  showMessage("Game Stopped");
}

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(
    gameSettings["volume"] / 10,
    context.currentTime + 0.05,
    0.025
  );
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  //gets called by buttons on the screen

  // console.log(tonePlaying);
  // stopTone();
  if (!tonePlaying) {
    // console.log("User Sound Played");
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(
      gameSettings["volume"] / 10,
      context.currentTime + 0.05,
      0.025
    );
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  //gets called by buttons on the screen  and playTone, stops the sound
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

function lightButton(btn) {
  //gets called by buttons on the screen  and playSingleClue, lights the button
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  //gets called by buttons on the screen  and playSingleClue, unlights the button
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  //gets called by playClueSequence, calls lightButton and playTone and setTimeout to call clearButton
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  //called by start and guess, calls timer, makes up the pattern, loops through the pattern making a setTimeout to call playSingleClue until progress,
  var started = Math.round(Date.now());
  print(`Pattern is ${pattern}`);
  timer(progress);
  guessCounter = 0;
  context.resume(); //This code disappeared after I was told to write it
  let delay = nextClueWaitTime;
  pattern.push(Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0); //To get infinity to work with the least amount of code I write the pattern here
  for (let i = 0; i <= progress; i++) {
    //pattern equals random stuff
    /*
    pattern.push(Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0)
      */

    // console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  //called by guess, calls stopGame display lost
  document.getElementById("livesPlaceholder").innerText = 0;
  stopGame();
  alert("Game Over. You lost! \n Progress: " + progress);
}

function winGame() {
  //called by guess, calls stopGame display win
  stopGame();
  alert("Game Over. You Won!");
}

function guess(btn) {
  //called by HTML buttons, if not gamePlaying or guessed before validGuessTime return,  if the guess is wrong, strikes++ and calls loseGame and returns only if strikes is >= lives anything else and it updates the lives on screen calls playClueSequence and return, if the user still has more guesses it returns after guessCounter++, if the user finished guessing progress++ updates the progress on screen, makes cluePauseTime and clueHoldTime less if clueHoldTime > 150 and finially playCluesequence and returns, if noones of the above conditions are meant it call winGame()
  // console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  } else if (!(Date.now() > validGuessTime)) {
    showMessage(
      `Please wait ${(validGuessTime - Date.now()) / 1000}s to guess`
    );
    console.log(
      `Please wait ${(validGuessTime - Date.now()) / 1000}s to guess`
    );
    return;
  } else if (!(pattern[guessCounter] == btn)) {
    strikes++;
    if (strikes >= gameSettings["lives"]) {
      loseGame();
      return;
    } else {
      document.getElementById("livesPlaceholder").innerText =
        gameSettings["lives"] - strikes;
      playClueSequence();
      return;
    }
  } else if (!(guessCounter == progress)) {
    guessCounter++;
    return;
  } else if (!(progress == gameSettings["patternLength"] - 1)) {
    progress++;
    document.getElementById("progressPlaceholder").innerText = progress;
    if (clueHoldTime > 150) {
      cluePauseTime *= gameSettings["speedDecay"];
      clueHoldTime *= gameSettings["speedDecay"];
    }
    playClueSequence();
    return;
  } else {
    winGame();
  }
}
//
//
//
//
//
//
///
//

function showSettingContainer() {//called by HTML settings buttons, if not playing( if settings isn't showns it shows settings if settings is shown it calls cancel) else shoes messages 
  //
  if (gamePlaying == false) {
    if (document.getElementById("settingsContainer").classList == "hidden") {
      document.getElementById("settingsContainer").classList.remove("hidden");
      document.getElementById("settings").innerText = "Cancel";
    } else {
      cancel();
    }
  } else {
    showMessage("Please stop the game to change settings");
    // console.log("Error");
  }
}

function cancel() {//called by showSettingContainer, goes through userGameSettings to set their porperty and the values to what is in gameSettings, calls close
  //I could change this by hard coding userGameSettings and the slider infos to be the same so all I have to do is clone
  for (const property in userGameSettings) {
    if (userGameSettings[property] != gameSettings[property]) {
      document.getElementById(property).innerHTML =
        document.getElementById(property + "Slider").value =
        userGameSettings[property] =
          gameSettings[property];
    }
  }
  close();
}

function close() {//called by cancel and applySettings, closes settings container
  document.getElementById("settingsContainer").classList.add("hidden");
  document.getElementById("settings").innerText = "Settings";
}

function updateFreqMap(buttonAmount) {//called in line and updateButtons, 
  //freqMap is populated with values between 260 and 500
  freqMap = [];
  let temp = (500 - 260) / (buttonAmount - 1);
  for (let i = 0; i < buttonAmount; i++) {
    freqMap[i] = Math.round(260 + temp * i);
  }
  console.log("Frequency Map is ", freqMap);
}

function updateButtons() {
  let buttonAmount = gameSettings["buttonAmount"];
  for (let i = buttonAmount; i < 10; i++) {
    document.getElementById("button" + i).classList.add("hidden");
    // console.log("button" + i, "is hidden");
  }
  for (let i = 0; i < buttonAmount; i++) {
    document.getElementById("button" + i).classList.remove("hidden");
    // console.log("button", i, "is shown");
  }
  updateFreqMap(buttonAmount);
}
function findInfinity() {
  if (userGameSettings["lives"] == 21) {
    userGameSettings["lives"] = Infinity;
    gameSettings["lives"] = Infinity;
  }
  if (userGameSettings["patternLength"] == 31) {
    userGameSettings["patternLength"] = Infinity;
    gameSettings["patternLength"] = Infinity;
  }
  if (userGameSettings["timePerButton"] == 11) {
    userGameSettings["timePerButton"] = Infinity;
    gameSettings["timePerButton"] = Infinity;
  }
}

//
//
//
// j
//
//
//
//

function applySettings(message = "Applied Settings") {
  //called by HTML apply button, its calls updateButtons, calls findInifnity, clones userGameSettings to gameSettings, updates livesPlaceholder and closes the settings screen

  // console.log("Change in button amount");
  updateButtons(userGameSettings["buttonAmount"]);
  findInfinity();
  gameSettings = Object.assign({}, userGameSettings);
  document.getElementById("livesPlaceholder").innerText = gameSettings["lives"];

  showMessage(message);
  close();
}

function saveSettings() {
  //called by HTML  save button
  applySettings("Saved Settings");
  saveCookie();
}

function updateSlider() {
  //should be called to clones gameSettings value into sliderPlaceholders, meant to be used along side load cookies

  for (let elem in gameSettings) {
    let value = gameSettings[elem];

    let sliderElem = document.getElementById(`${elem}Slider`);

    console.log(elem, value, sliderElem);

    if (elem != NaN) {
      sliderElem.value = value;
    }
    if (elem != NaN) {
      updateSliderPlaceholder(`${elem}Slider`, elem);
    }
    // updateSliderPlaceholder(sliderElem, elem);

    //"nameofrange".value = number I want
  }
}

function updateSliderPlaceholder(sliderElem, placeholder) {
  //called when HTML slider value is changed to display its value next to it in the placeholder
  sliderElem = document.getElementById(sliderElem);

  console.log(gameSettings);
  // var sliderElem = document.getElementById(slider);
  var placeholderElem = document.getElementById(placeholder);
  userGameSettings[placeholder] = Number(sliderElem.value);
  placeholderElem.innerHTML = userGameSettings[placeholder];
}

function showMessage(info) {
  document.getElementById("errorMessage").innerHTML = info;

  // print("Adding Show");
  document.getElementById("errorMessage").classList.add("show");

  setTimeout(function () {
    // print("Removing Show");
    document.getElementById("errorMessage").classList.remove("show");
  }, 4000);
}

function loadCookie(/*load = true*/) {
  // loads cookies and if its not empty or less than 90 in length it changes the values in userGameSettings to cookies and calls applySettings, TODO: updates both slider value and sliderPlacehooder to reflect the current values

  console.log(`Cookie is "${cookie}"`);

  let cookie = decodeURIComponent(document.cookie) + ";";

  if (cookie == "" || cookie == 0) {
    console.log("No cookies");
    return;
  }
  if (cookie.length < 90) {
    console.log("An error occured when reading cookies");
    return;
  }
  for (let key in userGameSettings) {
    let index = cookie.indexOf(key);
    let valueStart = index + key.length + 1;
    let value = cookie.slice(valueStart, cookie.indexOf(";", valueStart));
    if (value != userGameSettings[key]) {
      console.log(`Changing ${userGameSettings[key]} to ${value} in ${key}2`);
    }
    userGameSettings[key] = value;
  }
  applySettings("Loaded Previous Save");
  updateSlider();
  // applySettings("Loaded Previous Save");
  console.log(gameSettings);
  // updateButtons(gameSettings["buttonAmount"]);
}

function saveCookie() {
  //called by saveSettings, takes the values in gameSettings and saves them
  console.log(document.cookie);
  for (let key in gameSettings) {
    let value = gameSettings[key];
    console.log(`Saving ${key} as ${value}`);
    document.cookie = key + "=" + value + ";" + ";path=/";
  }
  console.log(document.cookie);
}

function clearCookies() {
  //called by HTML clear button, clears the cookies, outputs 0 into document.cookie
  console.log(document.cookie);
  for (let key in gameSettings) {
    let value = gameSettings[key];
    document.cookie =
      key + "=" + ";" + "expires=Thu, 01 Jan 1970 00:00:00 UTC;" + ";path=/";
  }
  console.log(document.cookie);
  showMessage("Cookies Cleared");
}
