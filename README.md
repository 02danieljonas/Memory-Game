# Pre-work - *Memory Game*

**Memory Game** is a Light & Sound Memory game to apply for CodePath's SITE Program. 

Submitted by: Daniel Jonas

Time spent: 45+ hours

Link to project: https://wry-tungsten-smartphone.glitch.me/

## Required Functionality

The following **required** functionality is complete:

* [X] Game interface has a heading (h1 tag), a line of body text (p tag), and four buttons that match the demo app
* [X] "Start" button toggles between "Start" and "aStop" when clicked. 
* [X] Game buttons each light up and play a sound when clicked. 
* [X] Computer plays back sequence of clues including sound and visual cue for each button
* [X] Play progresses to the next turn (the user gets the next step in the pattern) after a correct guess. 
* [X] User wins the game after guessing a complete pattern
* [X] User loses the game after an incorrect guess

The following **optional** features are implemented:

* [X] Any HTML page elements (including game buttons) has been styled differently than in the tutorial
* [X] Buttons use a pitch (frequency) other than the ones in the tutorial
* [X] More than 4 functional game buttons
* [X] Playback speeds up on each turn
* [X] Computer picks a different pattern each time the game is played
* [X] Player only loses after 3 mistakes (instead of on the first mistake)
* [ ] Game button appearance change goes beyond color (e.g. add an image)
* [ ] Game button sound is more complex than a single tone (e.g. an audio file, a chord, a sequence of multiple tones)
* [X] User has a limited amount of time to enter their guess on each turn

The following **additional** features are implemented:

- [X] Sliders to change settings (volume, game length, lives, button amount, seconds per round, time decay)
- [X] Saved configuration info in cookies
- [X] Clear cookies
- [X] Infinity options for lives and game length
- [X] Number Keys can be used as input
- [X] Size of game buttons shrink for smaller screens
- [X] Replaced alert() with a pop up
- [X] sequenced is repeated if user guesses wrong
- [X] connecting all of the above features


## Video Walkthrough (GIF)

If you recorded multiple GIFs for all the implemented features, you can add them here:<br>
![](http://g.recordit.co/7z89Pr3vwL.gif)
![](http://g.recordit.co/zknIu1Msju.gif)
![](http://g.recordit.co/lc5oAfUbfb.gif)
![](http://g.recordit.co/atkLI7tsia.gif)
---
![](http://g.recordit.co/Fk2aDq0BEU.gif)
![](http://g.recordit.co/sAXUdSlJjY.gif)
![](http://g.recordit.co/ErHsB5xOYT.gif)



## Reflection Questions
1. If you used any outside resources to help complete your submission (websites, books, people, etc) list them here. 
    My friend Smyvens and sister play tested my game.
   Citation:
    https://www.w3schools.com, https://www.codegrepper.com/code-examples/javascript/how+to+append+empty+array+in+javascript, https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs, https://developer.mozilla.org/en-US/docs/Web/HTML, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference, https://stackoverflow.com/questions/15189857/what-is-the-most-efficient-way-to-empty-a-plain-object-in-javascript, https://dev.to/sanchithasr/7-ways-to-convert-a-string-to-number-in-javascript-4l, https://www.samanthaming.com/tidbits/70-3-ways-to-clone-objects/, https://www.youtube.com/watch?v=YUdc2szWz8Q, https://www.thoughtco.com/create-a-shorter-if-statement-in-javascript-2037428#:~:text=variable%20name%20contains.-,A%20Shorter%20IF%20Statement,are%20optional%20for%20single%20statements)., https://www.youtube.com/watch?v=muE2B0Zylbw, https://www.gradientmagic.com/
    For the success screen I used https://www.youtube.com/watch?v=MBaw_6cPmAw because I thought there was a special html/javascript command to have a pop up like alert().

2. What was a challenge you encountered in creating this submission (be specific)? How did you overcome it? (recommended 200 - 400 words)
    An issue I had with this project was getting values from the slider and showing the slider info to the user. I tried my hardest and kept trying to use google and for some reason, I couldn't find a way to extract the values from the sliders. I took a break and then started to work on other features, I eventually saw what I wanted to implement on w3schools, so I opened up inspect elements and saw how they got it working. 
    When working with the cookies I came upon a similar issue, updating the value of the sliders themselves, for some reason kept not working, this was honestly very annoying, the value NaN kept being returned, I got through it by making sure the value I was extracting from the cookies were what I wanted. If I had more time I might change from cookies to local storage but my implementation of cookies works very well and I currently have them automatically clear after the browser is closed.
    I don't know why but I had an issue with getting the showMessage() working, I couldn't get it to pop up and fade to opacity 0, thinking about it now it was probably an issue with my CSS priority. I worked on showMessage much later after I saw how priority was used with another feature I worked on.
    When I had an issue, it seems like the best solution is to relax and come back later with a clear head or to read the documentation.
    Another challenge was getting through the final process of the submission, ever time I went to record the gif I notice an error or something I wanted to change so I had to stop and fix it. Eventually, I felt like the recording went perfectly and I noticed zero glitches, after this I had to learn that Github had a size limit for gif autoplay.

3. What questions about web development do you have after completing your submission? (recommended 100 - 300 words) 
    After completing my submission a question I have is how do I keep my code clean? For this project I have over 400+ lines of JavaScript I have no idea how to keep it all formated and placed in a way that could be read well. Another question I have is on website design. I have plans on making a portfolio website but I do not have any ideas on the design of it. I do not know if the best way forward is to look at a template and copy it or just follow a tutorial. I think the best idea is to start from scratch and come up with your own design but what do you do when you can't think of anything original?

4. If you had a few more hours to work on this project, what would you spend them doing (for example: refactoring certain functions, adding additional features, etc). Be specific. (recommended 100 - 300 words) 
    If I had a few more hours to work on this project I would try to make my code more readable for anyone who looks at it. My friend Smyvens also complained about the length of my Javascript so I would also try to cut that down. I might also change out my use of cookies for local storage. I am also thinking of making the buttons a template, so that it's easier for the user to make much more than 10 buttons without having to copy and paste the same CSS and HTML to make extra buttons. Another feature I could implement is connecting to a DynamoDB table to allow for a Leaderboard for everyone who visits and also a difficulty option (easy, medium, hard).

## Interview Recording URL Link

https://youtu.be/hnduV2GdD2w


## License

    Copyright Daniel Jonas

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
