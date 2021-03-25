# Nokia-style snake game

This simple, retro-styled snake game is based on the [Scrimba tutorial](https://scrimba.com/learn/snakegame) by Ania Kubow. It's built entirely with vanilla JavaScript.

I've had a lot of fun adding my own styling and expanding the functionality, such as:

- persistent hiscore (using the web storage API)
- separate play & reset buttons
- pause function
- sound effects
- start, pause and gameover screens
- d-pad-style buttons for use on mobile devices

I also significantly refactored parts of the code to make it more readable and fix some minor issues.

You can [see the game in action here](https://mercboy-snake.netlify.app/).

## Notes

# Audio on iOS

So, iOS will not play any HTML5 audio that is not directly initiated by the user. I guess this is to prevent annoying autoplaying music, etc but it's very frustrating when you're trying to implement game audio!

I found a hack to workaround this issue. Basically, you can "unlock" the audio objects by setting up an event listener that plays all the sound the first time the user touches the screen (`touchscreen` event). This is what I implemented:

```JavaScript
const audioToUnlock = []
const gulpSound = new Audio('./media/cartoon-gulp.mp3')
const splatSound = new Audio('./media/cartoon-splat.mp3')
audioToUnlock.push(gulpSound)
audioToUnlock.push(splatSound)
document.addEventListener('touchstart', unlockAudioForiOS)

function unlockAudioForiOS () {
  audioToUnlock.forEach(audio => {
    audio.play()
    audio.pause()
    audio.currentTime = 0
  })

  document.removeEventListener('touchstart', unlockAudioForiOS)
}
```
