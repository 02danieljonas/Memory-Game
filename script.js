var pattern = []; //array contain the pattern for that round
var freqMap;
var clueInProgress = false; //is a clue playing right now
var progress = 0; //Score of the player
var gamePlaying = false; //Has a game started
var tonePlaying = false; //is a tone playing?
var guessCounter = 0; //
var strikes = 0; //how much times the player guessed wrong

var colors = ["red", "orange", "yellow", "green", "cyan", "blue", "indigo", "violet", "darkgreen", "darkolivegreen", "darkorchid", "darkseagreen", "deepskyblue", "forestgreen", "ghostwhite"]


// let S = 100
// let L = 50
// var colors = [];
//330
// for (let H = 0; H<331;H+=22){
//   if (H == 88){H=55}
//   colors.push(`hsl(${H}, ${S}%, ${L}%)`)
// }

// var colorNumber = 0;
// console.log(colors[colorNumber])
// console.log(colors)

// function changeColor(id){
//   document.getElementById(id).style.background = colors[colorNumber];
//   console.log(colors[colorNumber])
//   colorNumber++
//   colorNumber<=17 ? colorNumber++ : colorNumber=0
// }
/*
for (let H = 0; H<331;H+=22){
  H == 132 ? tempColor = "darkgreen": tempColor = `hsl(${H}, 50%, 100%)`;
  colors.push(tempColor)
}

var colorNumber = 0;
console.log(colors[colorNumber])
console.log(colors)

function changeColor(id){
  document.getElementById(id).style.background = colors[colorNumber];
  console.log(colors[colorNumber])
  colorNumber++
  colorNumber<=15 ? colorNumber++ : colorNumber=0
}
*/

var gameSettings = {
  //the configuration object
  patternLength: 8,
  volume: 3,
  lives: 3,
  buttonAmount: 4,
  timePerRound: 10,
  timeModifier: 10,
};
var userGameSettings = Object.assign({}, gameSettings); //clones gameSettings, UserGS is used in for the settings screen and if the user presses apply, it runs the function that applies it

loadCookie();
updateSlider();
applySettings(false);

document.addEventListener("keydown", (btn) => {
  btn = parseInt(btn.key);
  if (!isNaN(btn)) {
    if (btn != 0) {
      btn--;
    } else {
      btn = 9;
    }
    if (btn < gameSettings["buttonAmount"]) {
      if (!canPlay) {
        return;
      }
      lightButton(btn);
      startTone(btn);
      setTimeout(stopTone, 100, false);
      setTimeout(clearButton, 100, btn);
      guess(btn);
    }
  }
});

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
var timeTimer;

function startGame() {
  //called by HTML start button, if settings is hidden, it resets strikes pattern clueHoldTime cluePauseTime HTML element livesPlaceholder progress, sets gamePlaying to true and hides swap button and remove hide from stop button, calls playClueSequence
  // updateScreenValues();
  if (document.getElementById("settingsContainer").classList == "hidden") {
    strikes = 0;
    pattern = [Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0];
    clueHoldTime = 1000; //how long each clue is played for
    cluePauseTime = 333; //how long to pause between clues
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
  // updateScreenValues();
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  showMessage("Game Stopped");
  clearInterval(timeTimer);
  canPlay = true;
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
    stopTone(false);
  }, len);
}

function startTone(btn) {
  //gets called by buttons on the screen
  if (!tonePlaying && canPlay) {
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

function stopTone(callFromHTML = true) {
  //gets called by buttons on the screen  and playTone, stops the sound
  if (callFromHTML && !canPlay) {
    //
    return;
  }
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

  whenCanPlay();

  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function whenCanPlay() {
  // called by playClueSequence, sets validGuessTime to the time the player should guess the pattern, TODO: Change to using setTimeout
  if (!gamePlaying) {
    return;
  }
  let howLong = nextClueWaitTime; //
  howLong += (progress + 1) * (cluePauseTime + clueHoldTime) - 333;
  setTimeout(function () {
    canPlay = true;
    if (gameSettings["timePerRound"] != Infinity) {
      setCountDown();
    }
  }, howLong);
}

function setCountDown() {
  if (!(canPlay && gamePlaying)) {
    return;
  }
  let timerPlaceholder = Math.round(
    gameSettings["timePerRound"] *
      ((100 + (progress + 1) * gameSettings["timeModifier"]) / 100)
  );
  document.getElementById("timerPlaceholder").innerText =
    timerPlaceholder > 1 ? timerPlaceholder : 1;
  clearInterval(timeTimer);

  timeTimer = setInterval(function () {
    if (!(canPlay && gamePlaying)) {
      return;
    }
    timerPlaceholder--;
    document.getElementById("timerPlaceholder").innerHTML = timerPlaceholder;
    if (timerPlaceholder < 0) {
      document.getElementById("timerPlaceholder").innerHTML = 0;
      guess(-1);
    }
  }, 1000);
}

function guess(btn) {
  //called by HTML buttons, if not gamePlaying or guessed before validGuessTime return,  if the guess is wrong, strikes++ and calls loseGame and returns only if strikes is >= lives anything else and it updates the lives on screen calls playClueSequence and return, if the user still has more guesses it returns after guessCounter++, if the user finished guessing progress++ updates the progress on screen, makes cluePauseTime and clueHoldTime less if clueHoldTime > 150 and finially playCluesequence and returns, if noones of the above conditions are meant it call winGame()
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
      playClueSequence();
      return;
    }
  } else if (!(guessCounter == progress)) {
    guessCounter++;
    return;
  } else if (!(progress == gameSettings["patternLength"] - 1)) {
    progress++;
    updateScreenValues();
    clearInterval(timeTimer);
    pattern.push(Math.floor(Math.random() * gameSettings["buttonAmount"]) + 0); //To get infinity to work with the least amount of code I write the pattern here
    if (clueHoldTime > 300) {
      cluePauseTime *= 0.88;
      clueHoldTime *= 0.88;
    }
    playClueSequence();
    return;
  } else {
    progress++;
    updateScreenValues();
    clearInterval(timeTimer);
    winGame();
  }
}

function loseGame() {
  //called by guess, calls stopGame displays lost
  stopGame();
  activateModal("Better luck next time", "red");
}

function winGame() {
  //called by guess, calls stopGame displays win
  stopGame();
  activateModal("Winner!!!!", "green");
}

function showSettingContainer() {
  //called by HTML settings buttons, if not playing( if settings isn't showns it shows settings if settings is shown it calls cancel) else shoes messages
  if (gamePlaying == false) {
    if (document.getElementById("settingsContainer").classList == "hidden") {
      document.getElementById("settingsContainer").classList.remove("hidden");
      document.getElementById("settings").innerText = "Cancel";
      document.getElementById("overlay").classList.add("active");
      document.getElementById("overlay").style.opacity = "50%";
      document.getElementById("overlay").style.background = "black";
    } else {
      cancel();
    }
  } else {
    showMessage("Please stop the game to change settings");
  }
}

function cancel() {
  //called by showSettingContainer, goes through userGameSettings to set their porperty and the values to what is in gameSettings, calls close
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
  document.getElementById("overlay").classList.remove("active");
  document.getElementById("overlay").style.opacity = "0%";
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
}

function updateButtons() {
  //called by applySettings, goes through all the buttons and adds or remove the class hidden depending on if they are bigger or smaller than userGameSettings["buttonAmount"]
  for (let i = userGameSettings["buttonAmount"]; i < 10; i++) {
    document.getElementById("button" + i).classList.add("hidden");
  }
  for (let i = 0; i < userGameSettings["buttonAmount"]; i++) {
    document.getElementById("button" + i).classList.remove("hidden");
  }

  //updates the freqMap
  freqMap = [];
  let temp = (500 - 260) / (gameSettings["buttonAmount"] - 1);
  for (let i = 0; i < gameSettings["buttonAmount"]; i++) {
    freqMap[i] = Math.round(260 + temp * i);
  }
}

function updateScreenValues(updateTime = true) {
  document.getElementById("progressPlaceholder").innerText = progress;
  document.getElementById(
    "patternLengthPlaceholder"
  ).innerText = ` / ${gameSettings["patternLength"]}`;

  //update hearts
  let hearts = "";
  if (gameSettings["lives"] != Infinity && gameSettings["lives"] != 0) {
    for (let i = 0; i < gameSettings["lives"] - strikes; i++) {
      hearts += "♥ ";
    }
  } else {
    hearts = "♥×" + gameSettings["lives"];
  }
  document.getElementById("livesPlaceholder").innerText = hearts;

  if (updateTime) {
    let timerPlaceholder = Math.round(
      gameSettings["timePerRound"] *
        ((100 + (progress + 1) * gameSettings["timeModifier"]) / 100)
    );
    document.getElementById("timerPlaceholder").innerText =
      timerPlaceholder > 1 ? timerPlaceholder : 1;
  }
  console.log(document.getElementById("timerPlaceholder").innerHTML);
}

function saveSettings() {
  //called by HTML save button
  applySettings(false);
  showMessage("Cookies Saved");
  saveCookie();
}

function loadCookie() {
  // loads cookies and if its not empty or less than 90 in length it changes the values in userGameSettings to cookies and calls applySettings, TODO: updates both slider value and sliderPlacehooder to reflect the current values
  let cookie = decodeURIComponent(document.cookie) + ";";
  if (cookie == ";" || cookie == "0;") {
    showMessage("No cookies");
    return;
  } else if (cookie.length < 70) {
    showMessage("An error occured with the cookies");
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
  applySettings(false);
}

function saveCookie() {
  //called by saveSettings, takes the values in gameSettings and saves them
  for (let key in gameSettings) {
    let value = gameSettings[key];
    // console.log(`Saving ${key} as ${value}`);
    document.cookie = key + "=" + value + ";" + ";path=/";
  }
}

function clearCookies() {
  //called by HTML clear button, clears the cookies, outputs 0 into document.cookie
  for (let key in gameSettings) {
    let value = gameSettings[key];
    document.cookie =
      key + "=" + ";" + "expires=Thu, 01 Jan 1970 00:00:00 UTC;" + ";path=/";
  }
  showMessage("Cookies Cleared");
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

function updateSliderPlaceholder(sliderElem, placeholder) {
  //sliderElem is the slider ID and placeholder is the Key
  let sliderElemValue = document.getElementById(sliderElem).value;
  sliderElemValue = sliderElemValue == 31 ? Infinity : sliderElemValue;
  let placeholderElem = document.getElementById(placeholder);
  placeholderElem.innerHTML = sliderElemValue;
  userGameSettings[placeholder] = sliderElemValue;
}

function showButtonNumbers(checked) {
  if (checked) {
    document.querySelectorAll(".buttonNumber").forEach((item) => {
      item.style.display = "revert";
    });
  } else {
    document.querySelectorAll(".buttonNumber").forEach((item) => {
      item.style.display = "none";
    });
  }
}

function showMessage(info) {
  document.getElementById("errorMessage").innerHTML = info;
  document.getElementById("errorMessage").classList.add("show");
  setTimeout(function () {
    document.getElementById("errorMessage").classList.remove("show");
  }, 4000);
}

function activateModal(headerText, color) {
  document.getElementById("modal").classList.add("active");
  document.getElementById("overlay").classList.add("active");
  document.getElementById("modalHeader").style.background = color;
  document.getElementById("overlay").style.background = color;
  document.getElementById("overlay").style.opacity = "50%";
  let output = `Progress: ${progress} / ${gameSettings["patternLength"]} <br>`;
  if (headerText == "Winner!!!!") {
    output = `Progress: ${gameSettings["patternLength"]} / ${gameSettings["patternLength"]} <br>`;
  }
  output += `\n Lives: ${gameSettings["lives"]} Strikes: ${strikes} <br>`;
  output += `Button Amount ${gameSettings["buttonAmount"]} <br>`;
  output += `Time: ${gameSettings["timePerRound"]} <br> Time Modifier: ${gameSettings["timeModifier"]}% <br>`;
  document.getElementById("modalBody").innerHTML = output;
  document.getElementById("modalTitle").innerHTML = headerText;
}

function deactivateModal() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  document.getElementById("overlay").style.opacity = "0%";
}

function closeOverlay() {
  deactivateModal();
  cancel();
}
