
var canvas,
    ctx,
    width = 600,
    height = 600,
    enemyTotal = 5,
    enemies = [],
    enemy_x = 50,
    enemy_y = -45,
    enemy_w = 50,
    enemy_h = 38,
    speed = 3,
    enemy,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    ship,
    ship_x = (width / 2) - 25,
    ship_y = height - 75,
    ship_w = 50,
    ship_h = 57,
    laserTotal = 2,
    lasers = [],
    score = 0,
    alive = true,
    lives = 3,
		starfield,
		starX = 0,
		starY = 0,
		starY2 = -600,
		gameStarted = false;

//Array to hold all the enemies on screen
for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60;
}

//Clears the canvas so it can be updated
function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

//Cycles through the array and draws the updated enemy position
function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1]);
  }
}

//If an arrow key is being pressed, moves the ship in the right direction
function drawShip() {
  if (rightKey) ship_x += 5;
  else if (leftKey) ship_x -= 5;
  if (upKey) ship_y -= 5;
  else if (downKey) ship_y += 5;
  if (ship_x <= 0) ship_x = 0;
  if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
  if (ship_y <= 0) ship_y = 0;
  if ((ship_y + ship_h) >= height) ship_y = height - ship_h;
  ctx.drawImage(ship, ship_x, ship_y);
}

//This moves the enemies downwards on the canvas and if one passes the bottom of the canvas, it moves it to above the canvas
function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][1] < height) {
      enemies[i][1] += enemies[i][4];
    } else if (enemies[i][1] > height - 1) {
      enemies[i][1] = -45;
    }
  }
}

//If there are lasers in the lasers array, then this will draw them on the canvas
function drawLaser() {
  if (lasers.length)
    for (var i = 0; i < lasers.length; i++) {
      ctx.fillStyle = '#f00';
      ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])
    }
}

//If we're drawing lasers on the canvas, this moves them up the canvas
function moveLaser() {
  for (var i = 0; i < lasers.length; i++) {
    if (lasers[i][1] > -11) {
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10) {
      lasers.splice(i, 1);
    }
  }
}

//Runs a couple of loops to see if any of the lasers have hit any of the enemies
function hitTest() {
  var remove = false;
  for (var i = 0; i < lasers.length; i++) {
    for (var j = 0; j < enemies.length; j++) {
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= (enemies[j][0] + enemies[j][2])) {
        remove = true;
        enemies.splice(j, 1);
        score += 10;
        enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
      }
    }
    if (remove == true) {
      lasers.splice(i, 1);
      remove = false;
    }
  }
}

//Similar to the laser hit test, this function checks to see if the player's ship collides with any of the enemies
function shipCollision() {
  var ship_xw = ship_x + ship_w,
      ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
    if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h) {
      checkLives();
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w) {
      checkLives();
    }
    if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0]) {
      checkLives();
    }
  }
}

//This function runs whenever the player's ship hits an enemy and either subtracts a life or sets the alive variable to false if the player runs out of lives
function checkLives() {
  lives -= 1;
  if (lives > 0) {
    reset();
  } else if (lives == 0) {
    alive = false;
  }
}

//This simply resets the ship and enemies to their starting positions
function reset() {
  var enemy_reset_x = 50;
  ship_x = (width / 2) - 25, ship_y = height - 75, ship_w = 50, ship_h = 57;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i][0] = enemy_reset_x;
    enemies[i][1] = -45;
    enemy_reset_x = enemy_reset_x + enemy_w + 60;
  }
}

//After the player loses all their lives, the continue button is shown and if clicked, it resets the game and removes the event listener for the continue button
function continueButton(e) {
  var cursorPos = getCursorPos(e);
  if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
    alive = true;
    lives = 3;
    reset();
    canvas.removeEventListener('click', continueButton, false);
  }
}

//holds the cursors position
function cursorPosition(x,y) {
  this.x = x;
  this.y = y;
}

//finds the cursor's position after the mouse is clicked
function getCursorPos(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var cursorPos = new cursorPosition(x, y);
  return cursorPos;
}

//Draws the text for the score and lives on the canvas and if the player runs out of lives, it's draws the game over text and continue button as well as adding the event listener for the continue button
function scoreTotal() {
  ctx.font = 'bold 20px VT323';
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ', 10, 55);
  ctx.fillText(score, 70, 55);
  ctx.fillText('Lives:', 10, 30);
  ctx.fillText(lives, 68, 30);
		if (!gameStarted) {
    ctx.font = 'bold 50px VT323';
    ctx.fillText('Canvas Shooter', width / 2 - 150, height / 2);
    ctx.font = 'bold 20px VT323';
    ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
    ctx.fillText('Use arrow keys to move', width / 2 - 100, height / 2 + 60);
    ctx.fillText('Use the x key to shoot', width / 2 - 100, height / 2 + 90);
  }
  if (!alive) {
    ctx.fillText('Game Over!', 245, height / 2);
    ctx.fillRect((width / 2) - 60, (height / 2) + 10,100,40);
    ctx.fillStyle = '#000';
    ctx.fillText('Continue?', 250, (height / 2) + 35);
    canvas.addEventListener('click', continueButton, false);
  }
}

//Draws and animates the background starfield
function drawStarfield() {
  ctx.drawImage(starfield,starX,starY);
  ctx.drawImage(starfield,starX,starY2);
  if (starY > 600) {
    starY = -599;
  }
  if (starY2 > 600) {
    starY2 = -599;
  }
  starY += 1;
  starY2 += 1;
}

//The initial function called when the page first loads. Loads the ship, enemy and starfield images and adds the event listeners for the arrow keys. It then calls the gameLoop function.
function init() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = 'assets/8bit_enemy.png';
  ship = new Image();
  ship.src = 'assets/ship.png';
  starfield = new Image();
  starfield.src = 'assets/starfield.jpg';
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
		canvas.addEventListener('click', gameStart, false);
  gameLoop();
}

function gameStart() {
  gameStarted = true;
  canvas.removeEventListener('click', gameStart, false);
}

//The main function of the game, it calls all the other functions needed to make the game run
function gameLoop() {
  clearCanvas();
  drawStarfield()
  if (alive && gameStarted && lives > 0) {
    hitTest();
    shipCollision();
    moveLaser();
    moveEnemies();
    drawEnemies();
    drawShip();
    drawLaser();
  }
  scoreTotal();
  game = setTimeout(gameLoop, 1000 / 30);
}

//Checks to see which key has been pressed and either to move the ship or fire a laser
function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
  if (e.keyCode == 38) upKey = true;
  else if (e.keyCode == 40) downKey = true;
  if (e.keyCode == 88 && lasers.length <= laserTotal) lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
}

//Checks to see if a pressed key has been released and stops the ships movement if it has
function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
  if (e.keyCode == 38) upKey = false;
  else if (e.keyCode == 40) downKey = false;
}

window.onload = init;

