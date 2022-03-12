/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

var pattern = [2, 2, 4, 3, 2, 1, 2, 4];

var progress = 0;

var gamePlaying = false;

var tonePlaying = false;

var volume = 0.051;

function startGame(){
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
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

//glitch dragging mouse away from screen causes sounds to continue until any button is pressed

var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)
