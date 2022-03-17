/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//https://www.w3schools.com/js/js_random.asp, https://www.codegrepper.com/code-examples/javascript/how+to+append+empty+array+in+javascript, https://www.w3schools.com/howto/howto_js_rangeslider.asp, https://www.w3schools.com/cssref/default.asp (used for finding random things), https://stackoverflow.com/questions/4015345/how-do-i-properly-escape-quotes-inside-html-attributes, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range, 

// TODO: add a configure button that allows you to configure the app with sliders
var patternLength = 10;
var pattern = [];
var clueInProgress = false;
var strikes = 0;
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var countDownTimer = 3;
var countDownTimerIncrement = 1.5;

var userGuessTime;

console.log(document.getElementById("settingsContainer").classList)


// TODO: fix glitch dragging mouse away from screen causes sounds to continue until any button is pressed
//TODO: fix glitch where if you know the pattern before hand sound will play on top of each other

function print(q) {
  console.log(q);
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

const clueHoldTime = 1000; //how long each clue is played for
const cluePauseTime = 333; //how long to pause between clues
const nextClueWaitTime = 1000; //how long to wait before next list of clues starts

function startGame() {
  pattern = [];
  for (let i = 0; i < patternLength; i++) {
    pattern.push(Math.floor(Math.random() * 4) + 1);
  };
  strikes = 3;
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  //console.log(context.currentTime)

  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  //console.log(tonePlaying)
  if (!tonePlaying) {
    console.log("User Sound Played");
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
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
  guessCounter = 0;
  context.resume(); //This code disappeared after I was told to write it
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
    userGuessTime = delay;
    // console.log("The user can play audio at " + userGuessTime);
    //probably can fix the issue by finding our what time the delays are over and only letting the user press when no delay is active
    //can't fix now, good luck future me :)
  }
}

function loseGame() {
  document.getElementById("placeHolder").innerText = 0
  stopGame();
  alert("Game Over. You lost! \n Progress: " + progress);
}

function winGame() {
  stopGame();
  alert("Game Over. You Won!");
}

function guess(btn) {
  console.log("User guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (!(pattern[guessCounter] == btn)) {
    if (strikes >= 2) {
      loseGame();
      return;
    } else {
      strikes++;
      document.getElementById("placeholder").innerText = 3-strikes
      playClueSequence();
      return;
    }
  }
  if (!(guessCounter == progress)) {
    guessCounter++;
    return;
  }
  if (!(progress == pattern.length - 1)) {
    progress++;
    playClueSequence();
    return;
  }
  winGame();
}


function showSettingContainer(){
  if(document.getElementById("settingsContainer").classList == "hidden"){
    document.getElementById("settingsContainer").classList.remove("hidden");
  }
  else{
    document.getElementById("settingsContainer").classList.add("hidden");
  }
}

function applySettings(){
  console.log("Hello: ")
  console.log(document.getElementById("settingsContainer"))
}

function updateSliderPlaceholder(slider, placeholder){
  var sliderElem = document.getElementById(slider);
  var placeholderElem = document.getElementById(placeholder);
  placeholderElem.innerHTML = sliderElem.value;
  placeholder.innerHTML = sliderElem.value;
}