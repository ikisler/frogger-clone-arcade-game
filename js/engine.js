/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
	/* Predefine the variables we'll be using within this scope,
	 * create the canvas element, grab the 2D context for that canvas
	 * set the canvas elements height/width and add it to the DOM.
	 */
	var doc = global.document,
		win = global.window,
		canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		lastTime;

	canvas.width = 505;
	canvas.height = 606;

	canvas.className = 'game';

	// Menu canvas
	canvasMenu = doc.createElement('canvas');
	ctx02 = canvasMenu.getContext('2d');
	canvasMenu.className = 'menu';
	canvasMenu.width = 505;
	canvasMenu.height = 606;

	// Wait for the rest of the page to load before adding canvases
	document.addEventListener('DOMContentLoaded', function() {
		// Get the containger div, then add canvases to it
		div = doc.body.getElementsByClassName('game-container');
		div[0].appendChild(canvas);
		div[0].appendChild(canvasMenu);
	}, false);

	/* This function serves as the kickoff point for the game loop itself
	 * and handles properly calling the update and render methods.
	 */
	function main() {
		/* Get our time delta information which is required if your game
		 * requires smooth animation. Because everyone's computer processes
		 * instructions at different speeds we need a constant value that
		 * would be the same for everyone (regardless of how fast their
		 * computer is) - hurray time!
		 */
		var now = Date.now(),
			dt = (now - lastTime) / 1000.0;

		/* Call our update/render functions, pass along the time delta to
		 * our update function since it may be used for smooth animation.
		 */
		update(dt);
		render();

		/* Set our lastTime variable which is used to determine the time delta
		 * for the next time this function is called.
		 */
		lastTime = now;

		/* Use the browser's requestAnimationFrame function to call this
		 * function again as soon as the browser is able to draw another frame.
		 */
		win.requestAnimationFrame(main);
	}

	/* This function does some initial setup that should only occur once,
	 * particularly setting the lastTime variable that is required for the
	 * game loop.
	 */
	function init() {
		// Put the player in the starting position
		reset();
		lastTime = Date.now();
		main();
	}

	/* This function is called by main (our game loop) and itself calls all
	 * of the functions which may need to update entity's data. Based on how
	 * you implement your collision detection (when two entities occupy the
	 * same space, for instance when your character should die), you may find
	 * the need to add an additional function call here. For now, we've left
	 * it commented out - you may or may not want to implement this
	 * functionality this way (you could just implement collision detection
	 * on the entities themselves within your app.js file).
	 */
	function update(dt) {
		updateEntities(dt);
		// checkCollisions();
	}

	/* This is called by the update function  and loops through all of the
	 * objects within your allEnemies array as defined in app.js and calls
	 * their update() methods. It will then call the update function for your
	 * player object. These update methods should focus purely on updating
	 * the data/properties related to  the object. Do your drawing in your
	 * render methods.
	 */
	function updateEntities(dt) {
		allEnemiesLen = allEnemies.length;

		for(var i =0; i<allEnemiesLen; i++) {
			allEnemies[i].update(dt);
		}
		player.update();
	}

	/* This function initially draws the "game level", it will then call
	 * the renderEntities function. Remember, this function is called every
	 * game tick (or loop of the game engine) because that's how games work -
	 * they are flipbooks creating the illusion of animation but in reality
	 * they are just drawing the entire screen over and over.
	 */
	function render() {
		/* This array holds the relative URL to the image used
		 * for that particular row of the game level.
		 */
		var rowImages = [
				'images/water-block.png',   // Top row is water
				'images/stone-block.png',   // Row 1 of 3 of stone
				'images/stone-block.png',   // Row 2 of 3 of stone
				'images/stone-block.png',   // Row 3 of 3 of stone
				'images/grass-block.png',   // Row 1 of 2 of grass
				'images/grass-block.png'    // Row 2 of 2 of grass
			],
			numRows = 6,
			numCols = 5,
			row, col;

		/* Loop through the number of rows and columns we've defined above
		 * and, using the rowImages array, draw the correct image for that
		 * portion of the "grid"
		 */
		for (row = 0; row < numRows; row++) {
			for (col = 0; col < numCols; col++) {
				/* The drawImage function of the canvas' context element
				 * requires 3 parameters: the image to draw, the x coordinate
				 * to start drawing and the y coordinate to start drawing.
				 * We're using our Resources helpers to refer to our images
				 * so that we get the benefits of caching these images, since
				 * we're using them over and over.
				 */
				ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
			}
		}

		// The score menu
		ctx.fillStyle = '#fff';
		ctx.font = '20px Arial';
		ctx.fillText('Score:', 8, 75);
		ctx.fillText(player.score, 70, 75);

		renderEntities();
	}

	/* This function is called by the render function and is called on each game
	 * tick. It's purpose is to then call the render functions you have defined
	 * on your enemy and player entities within app.js
	 */
	function renderEntities() {
		/* Loop through all of the objects within the allEnemies array and call
		 * the render function you have defined.
		 */
		var enemyLen = allEnemies.length;
		for(var i=0; i<enemyLen; i++) {
			allEnemies[i].render();
		}

		player.render();
	}

	/* This function does nothing but it could have been a good place to
	 * handle game reset states - maybe a new game menu or a game over screen
	 * those sorts of things. It's only called once by the init() method.
	 */
	function reset() {

		/*** The character selection screen ***/
		// Draw the character selection menu
		ctx02.fillStyle = '#fff';
		ctx02.strokeStyle = '#000';
		ctx02.fillRect(0, 100, 505, 300);
		ctx02.strokeRect(0, 100, 505, 300);

		ctx02.font = '20px Arial';
		ctx02.fillStyle = '#000';
		ctx02.fillText('Press letter key to choose a character:', 90, 150);

		ctx02.drawImage(Resources.get('images/char-boy.png'), 80, 150);
		ctx02.drawImage(Resources.get('images/char-pink-girl.png'), 200, 150);
		ctx02.drawImage(Resources.get('images/char-cat-girl.png'), 320, 150);

		ctx02.fillText('A', 125, 320);
		ctx02.fillText('B', 245, 320);
		ctx02.fillText('C', 365, 320);

		// When the user presses 'a', 'b', or 'c', get the character that they've selected
		document.addEventListener('keyup', function(e) {
			var allowedKeys = {
				65: 'a',
				66: 'b',
				67: 'c'
			};

			getCharacter(allowedKeys[e.keyCode]);
		});
	}

	function getCharacter(keyCode) {
		// Get the location of the click
		var canvasX = event.pageX;
		var canvasY = event.pageY;

		// If the player sprite is set to the placeholder, then assign player sprite based on which character was chosen
		if(player.sprite==='images/Star.png') {
			if(keyCode === 'a') {
				console.log("a");
				player.sprite = 'images/char-boy.png';
				clearMenu();
			}
			else if(keyCode === 'b') {
				player.sprite = 'images/char-pink-girl.png';
				clearMenu();
			}
			else if(keyCode === 'c') {
				player.sprite = 'images/char-cat-girl.png';
				clearMenu();
			}
		}
	}

	// Clear the character selection menu off the screen
	function clearMenu() {
		ctx02.clearRect(0, 0, canvas.width, canvas.height);
	}

	/* Go ahead and load all of the images we know we're going to need to
	 * draw our game level. Then set init as the callback method, so that when
	 * all of these images are properly loaded our game will start.
	 */
	Resources.load([
		'images/stone-block.png',
		'images/water-block.png',
		'images/grass-block.png',
		'images/enemy-bug.png',
		'images/char-boy.png',
		'images/char-pink-girl.png',
		'images/char-cat-girl.png',
		'images/Star.png'
	]);
	Resources.onReady(init);

	/* Assign the canvas' context object to the global variable (the window
	 * object when run in a browser) so that developer's can use it more easily
	 * from within their app.js files.
	 */
	global.ctx = ctx;
})(this);