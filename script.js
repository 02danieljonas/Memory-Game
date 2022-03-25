//https://www.w3schools.com/js/js_random.asp, https://www.codegrepper.com/code-examples/javascript/how+to+append+empty+array+in+javascript, https://www.w3schools.com/howto/howto_js_rangeslider.asp, https://www.w3schools.com/cssref/default.asp (used for finding random things), https://stackoverflow.com/questions/4015345/how-do-i-properly-escape-quotes-inside-html-attributes, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range, https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs, https://stackoverflow.com/questions/15189857/what-is-the-most-efficient-way-to-empty-a-plain-object-in-javascript, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs, https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l, https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in, https://www.w3schools.com/css/css_border.asp,https://www.w3schools.com/jsref/jsref_now.asp, https://www.w3schools.com/cssref/tryit.asp?filename=trycss_position2, https://www.w3schools.com/cssref/pr_class_position.asp, https://www.w3schools.com/js/js_cookies.asp, https://www.youtube.com/watch?v=YUdc2szWz8Q, https://www.thoughtco.com/create-a-shorter-if-statement-in-javascript-2037428#:~:text=variable%20name%20contains.-,A%20Shorter%20IF%20Statement,are%20optional%20for%20single%20statements)., https://developer.mozilla.org/en-US/docs/Web/API/setInterval, Smyvens, https://cssgradient.io/,

var pattern = []; //array contain the pattern for that round
var freqMap;
var clueInProgress = false; //is a clue playing right now
var progress = 0; //Score of the player
var gamePlaying = false; //Has a game started
var tonePlaying = false; //is a tone playing?
var guessCounter = 0; //
var strikes = 0; //how much times the player guessed wrong

var gameSettings = {
  //the configuration object
  patternLength: 8,
  volume: 3,
  lives: 3,
  buttonAmount: 4,
  timePerRound: Infinity,
  timeDecay: 0,
};

var userGameSettings = Object.assign({}, gameSettings); //clones gameSettings, UserGS is used in for the settings screen and if the user presses apply, it runs the function that applies it

loadCookie();
updateSlider();
applySettings(false);
updateFreqMap();
updateScreenValues();

function loadCookie() {
  // loads cookies and if its not empty or less than 90 in length it changes the values in userGameSettings to cookies and calls applySettings, TODO: updates both slider value and sliderPlacehooder to reflect the current values

  let cookie = decodeURIComponent(document.cookie) + ";";
  if (cookie == "" || cookie == "0;") {
    console.log("No cookies");
    return;
  } else if (cookie.length < 70) {
    console.log("An error occured when reading cookies");
    console.log(cookie);
    return;
  }
  for (let key in userGameSettings) {
    let index = cookie.indexOf(key);
    let valueStart = index + key.length + 1;
    let value = cookie.slice(valueStart, cookie.indexOf(";", valueStart));
    if (!isNaN(value)) {
      // console.log(`Changing ${userGameSettings[key]} to ${value} in ${key}`);
      userGameSettings[key] = value;
    }
  }
  showMessage("Cookies applied");
  console.log(gameSettings);
  applySettings(false);
  console.log(gameSettings);
}

function updateSlider() {
  //should be called to clones gameSettings value into sliderPlaceholders, meant to be used along side load cookies
  for (let key in userGameSettings) {
    let value = userGameSettings[key];

    let sliderElem = document.getElementById(`${key}Slider`);

    sliderElem.value = value == Infinity ? 31 : value;

    let placeholder = document.getElementById(key);

    placeholder.innerHTML = value;
  }
}

function updateFreqMap() {
  //called in line and updateButtons, empties freqMap calculates what info is needed through the passed argument buttonAmount and puts it into freqMap
  //freqMap is populated with values between 260 and 500
  freqMap = [];
  let temp = (500 - 260) / (gameSettings["buttonAmount"] - 1);
  for (let i = 0; i < gameSettings["buttonAmount"]; i++) {
    freqMap[i] = Math.round(260 + temp * i);
  }
  console.log("Frequency Map is ", freqMap);
}

function updateScreenValues() {
  document.getElementById("progressPlaceholder").innerText = progress;
  document.getElementById(
    "patternLengthPlaceholder"
  ).innerText = ` / ${gameSettings["patternLength"]}`;
  document.getElementById("livesPlaceholder").innerText =
    gameSettings["lives"] - strikes;
  document.getElementById("timerPlaceholder").innerText =
    gameSettings["timePerRound"];
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
var canPlay = true;

function whenCanPlay(clueLength) {
  // called by playClueSequence, sets validGuessTime to the time the player should guess the pattern, TODO: Change to using setTimeout
  let howLong = nextClueWaitTime; //
  howLong += (clueLength + 1) * (cluePauseTime + clueHoldTime) - 333; //for every clue add cPT and cHT to find out how long the clue plays for
  setTimeout(function () {
    canPlay = true;
    console.log("Time to Play");
    if (gameSettings["timePerRound"] != Infinity) {
      setCountDown();
    } //<---- do this when the you can play and stop on everything
  }, howLong);
}

function showSettingContainer() {
  //called by HTML settings buttons, if not playing( if settings isn't showns it shows settings if settings is shown it calls cancel) else shoes messages
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

function cancel() {
  //called by showSettingContainer, goes through userGameSettings to set their porperty and the values to what is in gameSettings, calls close
  //I could change this by hard coding userGameSettings and the slider infos to be the same so all I have to do is clone
  for (let key in userGameSettings) {
    if (userGameSettings[key] != gameSettings[key]) {
      document.getElementById(key).innerHTML =
        document.getElementById(key + "Slider").value =
        userGameSettings[key] =
          gameSettings[key];
    }
  }
  close();
}

function close() {
  //called by cancel and applySettings, closes settings container
  document.getElementById("settingsContainer").classList.add("hidden");
  document.getElementById("settings").innerText = "Settings";
}

var timeTimer;

function setCountDown() {
  if (canPlay) {
    document.getElementById("timerPlaceholder").innerHTML =
      (progress + 1) * gameSettings["timePerRound"];
    timeTimer = setInterval(function () {
      // print("Working");
      document.getElementById("timerPlaceholder").innerHTML--;

      if (document.getElementById("timerPlaceholder").innerHTML == 0) {
        strikes++;
        if (strikes >= gameSettings["lives"]) {
          loseGame();
        } else {
          document.getElementById("livesPlaceholder").innerText =
            gameSettings["lives"] - strikes;
          playClueSequence();
        }
        clearInterval(timeTimer);
      }
    }, 1000);
  }
}

function startGame() {
  //called by HTML start button, if settings is hidden, it resets strikes pattern clueHoldTime cluePauseTime HTML element livesPlaceholder progress, sets gamePlaying to true and hides swap button and remove hide from stop button, calls playClueSequence
  updateScreenValues();
  if (document.getElementById("settingsContainer").classList == "hidden") {
    strikes = 0;
    pattern = [Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0];
    clueHoldTime = 1000; //how long each clue is played for
    cluePauseTime = 333; //how long to pause between clues
    // document.getElementById("livesPlaceholder").innerText =
    //   gameSettings["lives"]; //updates the lives on the html
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    updateScreenValues();
    playClueSequence();
    showMessage("Game Started");
  } else {
    showMessage("Please Close Settings");
  }
}

function stopGame() {
  //setts gamePlaying to false, swaps hide from start button to stop buttons
  gamePlaying = false;
  clearInterval(timeTimer);

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
  if (!tonePlaying && canPlay) {
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
  //gets called by playSingleClue, lights the button
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  //gets called by playSingleClue, unlights the button
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
  canPlay = false;

  whenCanPlay(progress);

  guessCounter = 0;
  context.resume(); //This code disappeared after I was told to write it
  let delay = nextClueWaitTime;
  // print(`Pattern is ${pattern}`);

  for (let i = 0; i <= progress; i++) {
    //pattern equals random stuff
    /*
    pattern.push(Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0)
      */

    console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  //called by guess, calls stopGame display lost
  // document.getElementById("livesPlaceholder").innerText = 0;
  updateScreenValues();
  stopGame();
  // alert("Game Over. You lost! \n Progress: " + progress);
  activateModal("Better luck next time", "red");
}

function winGame() {
  //called by guess, calls stopGame display win
  stopGame();
  activateModal("Winner!!!!", "green");
  // alert("Game Over. You Won!");
}

document.addEventListener("keydown", (btn) => {
  btn = parseInt(btn.key);
  if (Number.isInteger(btn)) {
    if (btn != 0) {
      btn--;
    } else {
      btn = 9;
    }
    if (btn < gameSettings["buttonAmount"]) {
      keyboardGuess(btn);
    }
  }
});

function keyboardGuess(btn) {
  lightButton(btn);
  startTone(btn);

  setTimeout(stopTone, 100);
  setTimeout(clearButton(btn), 1000);
  console.log("Passing button" + btn);
  guess(btn);
}

function guess(btn) {
  //called by HTML buttons, if not gamePlaying or guessed before validGuessTime return,  if the guess is wrong, strikes++ and calls loseGame and returns only if strikes is >= lives anything else and it updates the lives on screen calls playClueSequence and return, if the user still has more guesses it returns after guessCounter++, if the user finished guessing progress++ updates the progress on screen, makes cluePauseTime and clueHoldTime less if clueHoldTime > 150 and finially playCluesequence and returns, if noones of the above conditions are meant it call winGame()
  // console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  } else if (!canPlay) {
    showMessage("Please Wait Until Simon finishes says");
    return;
  } else if (!(pattern[guessCounter] == btn)) {
    strikes++;
    clearInterval(timeTimer);
    if (strikes >= gameSettings["lives"]) {
      loseGame();
      return;
    } else {
      updateScreenValues();
      // document.getElementById("livesPlaceholder").innerText =
      //   gameSettings["lives"] - strikes;
      playClueSequence();
      return;
    }
  } else if (!(guessCounter == progress)) {
    guessCounter++;
    clearInterval(timeTimer);
    return;
  } else if (!(progress == gameSettings["patternLength"] - 1)) {
    progress++;
    // document.getElementById(
    //   "patternLengthPlaceholder"
    // ).innerText = ` / ${gameSettings["patternLength"]}`;
    updateScreenValues();
    clearInterval(timeTimer);
    pattern.push(Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0); //To get infinity to work with the least amount of code I write the pattern here
    // document.getElementById("progressPlaceholder").innerText = progress;
    if (clueHoldTime > 300) {
      cluePauseTime *= (100 - gameSettings["timeDecay"]) / 100;
      clueHoldTime *= (100 - gameSettings["timeDecay"]) / 100;
    }
    playClueSequence();
    return;
  } else {
    progress++;
    updateScreenValues();
    // document.getElementById("progressPlaceholder").innerText = progress;
    // document.getElementById(
    //   "patternLengthPlaceholder"
    // ).innerText = ` / ${gameSettings["patternLength"]}`;

    clearInterval(timeTimer);
    winGame();
  }
}

function updateButtons() {
  //called by applySettings, goes through all the buttons and adds or remove the class hidden depending on if they are bigger or smaller than userGameSettings["buttonAmount"]
  for (let i = userGameSettings["buttonAmount"]; i < 10; i++) {
    document.getElementById("button" + i).classList.add("hidden");
  }
  for (let i = 0; i < userGameSettings["buttonAmount"]; i++) {
    document.getElementById("button" + i).classList.remove("hidden");
  }
  updateFreqMap();
}

function applySettings(message = true) {
  //called by HTML apply button, its calls updateButtons, calls findInifnity, clones userGameSettings to gameSettings, updates livesPlaceholder and closes the settings screen
  updateButtons(userGameSettings["buttonAmount"]);
  gameSettings = Object.assign({}, userGameSettings);
  updateScreenValues();
  close();
  if (message) {
    showMessage("Applied Settings");
  }
  updateFreqMap();
}

function saveSettings() {
  //called by HTML save button
  applySettings(false);
  showMessage("Cookies Saved");
  saveCookie();
}

function updateSliderPlaceholder(sliderElem, placeholder) {
  //sliderElem is the slider ID and placeholder is the Key
  let sliderElemValue = document.getElementById(sliderElem).value;
  sliderElemValue = sliderElemValue == 31 ? Infinity : sliderElemValue;

  let placeholderElem = document.getElementById(placeholder);

  placeholderElem.innerHTML = sliderElemValue;
  userGameSettings[placeholder] = sliderElemValue;
}

function showMessage(info) {
  document.getElementById("errorMessage").innerHTML = info;

  document.getElementById("errorMessage").classList.add("show");

  setTimeout(function () {
    document.getElementById("errorMessage").classList.remove("show");
  }, 4000);
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

function activateModal(headerText, color) {
  // print("You should add confetti");
  document.getElementById("modal").classList.add("active");
  document.getElementById("overlay").classList.add("active");

  document.getElementById("modalHeader").style.background = color;
  document.getElementById("overlay").style.background = color;
  document.getElementById("overlay").style.opacity = "50%";

  //loop through this showing everything

  let output = `Progress: ${progress} / ${gameSettings["patternLength"]} <br>`;

  output += `\n Lives: ${gameSettings["lives"]} Strikes: ${strikes} <br>`;

  output += `Button Amount ${gameSettings["buttonAmount"]} <br>`;

  output += `Time: ${gameSettings["timePerRound"]} <br> Time Decay: ${gameSettings["timeDecay"]}% <br>`;

  document.getElementById("modalBody").innerHTML = output;

  document.getElementById("modalTitle").innerHTML = headerText;
}

// TODO: "Issue With ScreenUpdate Fix it";
// TODO: "When a time is given value is reset to starting time when clue is being given";

function deactivateModal() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  document.getElementById("overlay").style.opacity = "0%";
}
