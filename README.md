# Sky Glide

A simple browser game built with React where a flying squirrel glides through hoops. Press **Spacebar** or tap the screen to flap. Fly through the hoops to earn points. Missing a hoop ends the game.

## How to Play

1. Open `index.html` in your browser.
The page now bundles local copies of React, so no internet connection is required.
2. Press **Spacebar** or tap to make the squirrel flap upward.
3. Pass through the center of each hoop to score.
4. If you miss a hoop or fail to clear enough hoops every 30 seconds, the game ends. Click **Restart** to play again.

The game now runs for two minutes with circles speeding up by 10% every 10 seconds. You must pass through at least 10 hoops every 30 seconds to keep playing.

The game uses React for rendering and CSS transitions for smooth movement. A small oscillator sound is played on each flap. The layout is responsive, so you can play on desktop or mobile.
