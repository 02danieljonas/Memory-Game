/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.051;
var guessCounter = 0;

// TODO: fix glitch dragging mouse away from screen causes sounds to continue until any button is pressed

var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)

const clueHoldTime = 1000; //how long each clue is played for
const cluePauseTime = 333; //how long to pause between clues
const nextClueWaitTime = 1000; //how long to wait before next clue starts


function startGame(){
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence(); 
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn, len){
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  }, len)
     
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime+0.05,0.025)
    context.resume()
    tonePlaying = true;
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0, context.currentTime+0.05, 0.025)
  tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  context.resume() //This code disappeared after I was told to write it
  let delay = nextClueWaitTime
  for(let i=0; i<=progress; i++){
    console.log("Play single clue: " + pattern[i] + " in "+ delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i])
    delay += clueHoldTime
    delay += cluePauseTime
  }
}

function loseGame(){
  stopGame()
  alert("Game Over. You lost! \n Progress: "+progress)
}

function  winGame(){
  stopGame()
  alert("Game Over. You Won!")
}

function guess(btn){
  console.log("User guessed: "+btn)
    
  if(!gamePlaying){
    return;
  }
  
/*  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if (guessCounter == pattern.length){
        winGame()
      }
      else{
        guessCounter++;
        playClueSequence();
      }
    }
    else {
      guessCounter++;
    }
  }
  else{
    loseGame()
  }
 */ 
  if (!(pattern[guessCounter] == btn)){
    console.log("return 1")
    loseGame()
    return;
  }
  
  if (!(guessCounter < progress)){
    console.log("return 2")
    guessCounter++;
    return;
  }
  
  if (!(progress == pattern.length - 1)){
    console.log("return 3")

    progress++;
    playClueSequence();
    return;
  }
  winGame()
}