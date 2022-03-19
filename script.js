//https://www.w3schools.com/js/js_random.asp, https://www.codegrepper.com/code-examples/javascript/how+to+append+empty+array+in+javascript, https://www.w3schools.com/howto/howto_js_rangeslider.asp, https://www.w3schools.com/cssref/default.asp (used for finding random things), https://stackoverflow.com/questions/4015345/how-do-i-properly-escape-quotes-inside-html-attributes, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range, https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs, https://stackoverflow.com/questions/15189857/what-is-the-most-efficient-way-to-empty-a-plain-object-in-javascript, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs, https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l, https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in, https://www.w3schools.com/css/css_border.asp,https://www.w3schools.com/jsref/jsref_now.asp, https://www.w3schools.com/cssref/tryit.asp?filename=trycss_position2, https://www.w3schools.com/cssref/pr_class_position.asp,

var pattern = []; //array contain the pattern for that round
var clueInProgress = false; //is a clue playing right now
var progress = 0; //Score of the player
var gamePlaying = false; //Has a game started
var tonePlaying = false; //is a tone playing?
var guessCounter = 0; //
var validGuessTime; //contains the time the player should guess

//arrray.forEach(myFunction);

// var userGuessTime;

var strikes; //how much times the player guessed wrong

var gameSettings = {
  //the configuration object
  patternLength: 5,
  // countDownTimer: 3,
  // countDownTimerIncrement: 1.5,
  volume: 5,
  lives: 3,
  buttonAmount: 4,
  // buttonSize: 4,
};

var userGameSettings = Object.assign({}, gameSettings); //clones gameSettings, UserGS is used in for the settings screen and if the user presses apply, it runs the function that applies it

var freqMap;
updateFreqMap(gameSettings["buttonAmount"]);

// TODO: fix glitch dragging mouse away from screen causes sounds to continue until any button is pressed
// TODO: fix glitch where if you know the pattern before hand sound will play on top of each other
// TODO: fix error
// TODO: allow user to change game speed
// TODO: make game get faster every time
// TODO: allow user to decide how fast
// TODO: ADD infinity to game length and lives
// TODO: chang button size
// TODO: maybe ad DO RE MI FA SOL LA SI

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

// var timePerClue = clueHoldTime + cluePauseTime + nextClueWaitTime;//delete

function timer(clueLength) {
  //takes how much clue should be played
  let howLong = nextClueWaitTime; //
  howLong += (clueLength + 1) * (cluePauseTime + clueHoldTime); //for every clue add cPT and cHT to find out how long the clue plays for
  validGuessTime = Date.now() + howLong; //gives the time the user should press
  console.log(`Player should press after ${validGuessTime} ms`); //logs it
}

function startGame() {
  if (document.getElementById("settingsContainer").classList == "hidden") {
    //if settings is closed
    strikes = 0;
    pattern = [];
    for (let i = 0; i < gameSettings["patternLength"]; i++) {
      //takes game length and makes a random pattern
      pattern.push(
        Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0
      );
    }
    // console.log("Pattern is " + pattern);//logs the pattern

    document.getElementById("livesPlaceholder").innerText =
      gameSettings["lives"]; //updates the lives on the html
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");

    playClueSequence();
  }
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  //console.log(context.currentTime)

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
  // console.log(tonePlaying);
  // stopTone();
  if (!tonePlaying) {
    console.log("User Sound Played");
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
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  var started = Math.round(Date.now());
  timer(progress);

  guessCounter = 0;
  context.resume(); //This code disappeared after I was told to write it
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  document.getElementById("livesPlaceholder").innerText = 0;
  stopGame();
  alert("Game Over. You lost! \n Progress: " + progress);
}

function winGame() {
  stopGame();
  alert("Game Over. You Won!");
}

function guess(btn) {
  console.log("User guessed: " + btn);
  // console.log(`Time is ${Date.now()}\nTime is ${validGuessTime}`);
  // console.log(`Time is ${Date.now() / 1000}\nTime is ${validGuessTime / 1000}`);

  //i have the two need values I just need to read them and only let the user guess after valid
  //if not now >= VGT > return

  if (!gamePlaying) {
    return;
  } else if (!(Date.now() > validGuessTime)) {
    error(`Please wait ${validGuessTime - Date.now()}ms to guess`);
    console.log(`Please wait ${validGuessTime - Date.now()}ms to guess`);
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
  } else if (!(progress == pattern.length - 1)) {
    progress++;
    playClueSequence();
    return;
  } else {
    winGame();
  }
}

function showSettingContainer() {
  if (gamePlaying == false) {
    if (document.getElementById("settingsContainer").classList == "hidden") {
      document.getElementById("settingsContainer").classList.remove("hidden");
      document.getElementById("settings").innerText = "Cancel";
    } else {
      cancel();
    }
  } else {
    error("Please stop the game to change settings");
    // console.log("Error");
  }
}

function cancel() {
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

function close() {
  document.getElementById("settingsContainer").classList.add("hidden");
  document.getElementById("settings").innerText = "Settings";
}

function updateFreqMap(buttonAmount) {
  //freqMap is populated with values between 260 and 500
  freqMap = [];
  let temp = (500 - 260) / (buttonAmount - 1);
  for (let i = 0; i < buttonAmount; i++) {
    freqMap[i] = Math.round(260 + temp * i);
  }
  console.log("Map is ", freqMap);
}

function updateButtons(buttonAmount) {
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

function applySettings() {
  if (userGameSettings["buttonAmount"] != gameSettings["buttonAmount"]) {
    console.log("Change in buttons");
    updateButtons(userGameSettings["buttonAmount"]);
  }
  gameSettings = Object.assign({}, userGameSettings);
  close();
}

function updateSliderPlaceholder(slider, placeholder) {
  var sliderElem = document.getElementById(slider);
  var placeholderElem = document.getElementById(placeholder);
  userGameSettings[placeholder] = Number(sliderElem.value);
  placeholderElem.innerHTML = userGameSettings[placeholder];
}

function error(info) {
  document.getElementById("error").classList.remove("hidden");
  document.getElementById("error").innerHTML = info;
  document.getElementById("error").classList.add("hidden");
}
