/*** 
Helpful documents for making this:
https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub
https://www.youtube.com/watch?v=SxeHV1kt7iU&feature=youtu.be
***/

// Enemies our player must avoid
var Enemy = function(x, y) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	this.x = x;
	this.y = y;
	this.height = 80;
	this.width = 70;
	this.speed = Math.floor(Math.random() * 200 + 1);

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	var speed = this.speed * dt;
	this.x += speed;

	// When enemies go off the screen, reset them to the other side
	if(this.x > 550) {
		this.x = -100;
	}

	// Check for collisions by checking the player's location and size versus the enemy's location and size
	if (this.x < player.x + player.width && this.x + this.width > player.x && this.y < player.y + player.height && this.height + this.y > player.y) {
		// Send player back to start when they collide
		player.reset();
	}

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	this.reset();
	this.height = 50;
	this.width = 100;
	this.speed = 100;
	this.sprite = 'images/star.png'; // Placeholder until character is chosen
	this.score = 0;
};

// Reset the player back to starting location
Player.prototype.reset = function() {
	this.x = 200;
	this.y = 400;
};

// Update the player's location
Player.prototype.update = function(dt) {
	// Set the player's speed
	var speed = this.speed * dt;

	// When player wins, reset their location, update the score
	if(this.y < 40)
	{
		this.reset();
		this.score++;
	}
};

// Draw the player on the screen
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player movement
Player.prototype.handleInput = function(keyCode) {
	if(keyCode === 'left' && this.x > 0) {
		this.x -=100;
	}
	else if(keyCode === 'right' && this.x < 400) {
		this.x += 100;
	}
	else if(keyCode === 'up' && this.y > 0) {
		this.y -= 82;
	}
	else if(keyCode === 'down' && this.y < 400){
		this.y += 82;
	}
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

// Fill array with enemies -- starting i at desired x location, then adding pixels from there
for(var i=65; i<=225; i+=80)
{
	allEnemies.push(new Enemy(-100, i));
}

// Add one extra enemy on a random line
var randomLineNumber = Math.floor(Math.random() * 3);
allEnemies.push(new Enemy(-100, 65 + (80*randomLineNumber)));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
