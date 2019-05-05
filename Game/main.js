const gameState = {
	score: 0,
	xInit: 7,
	yInit: 7,
	xMax: 20,
	yMax: 15,
	corridorSize: 20,
	speed: 100, //means x pixels/sec
	move: true
};

const config = {
	type: Phaser.WEBGL,
	width: gameState.corridorSize * gameState.xMax,
	height: gameState.corridorSize * gameState.yMax,
	backgroundColor: 0x000000,//0xdda0dd,
	parent: "game",
	physics: {
		default: 'arcade',
			arcade: {
            debug: false
            }
        },
	scene: {
		preload,
		create,
		update,
		render
	}
};

const state = [{x: 0, y:0, direction: "right"}];
const posT = {
	x: 0,
	y: 0
}

const game = new Phaser.Game(config);

function preload() {4
	this.load.image('snakehead', 'Game/assets/snakehead.png');
}

function create(){
	gameState.baby = this.physics.add.sprite(
		Math.floor((gameState.xInit - 1/2) * gameState.corridorSize),
		Math.floor((gameState.yInit - 1/2) * gameState.corridorSize),
		'snakehead').setScale(0.6);
	gameState.cursors = this.input.keyboard.createCursorKeys();
	gameState.direct = "right";
	console.log("running");
	gameState.baby.setCollideWorldBounds(false);
	state[0].x = gameState.xInit;
	state[0].y = gameState.yInit;
	state[0].direction = gameState.direct;
	gameState.toys = this.physics.add.group();
	genToy(this.scene, gameState.toys);
	// genToyXY(posT);
	// gameState.toy = this.physics.add.sprite(
	// 	Math.floor((posT.x - 1/2) * gameState.corridorSize),
	// 	Math.floor((posT.y - 1/2) * gameState.corridorSize),
	// 	'snakehead').setScale(0.5);
	gameState.information = this.add.text(10,10,"Information: " + state[0].direction, { color: '#ffffff' });
	gameState.timedLoop = this.time.addEvent({ delay: Math.floor(20*1000/gameState.speed), callback: updateState, callbackScope: this, loop: true });
  }
  
const genToyXY = (toy)=>{
	let empty = false;
	let i = 0;
	let x = 0;
	let y = 0;
	while (!empty)
	{
		empty = true;
		x = Math.floor(Math.random()*(gameState.xMax))+1;
		y = Math.floor(Math.random()*(gameState.yMax))+1;
		while( i < state.length && empty === true)
		{
			if (state[i].x === x && state[i].y === y)
			{
				empty = false;
			}
			i++;
		}
	}
	toy.x = x;
	toy.y = y;
}

const genToy = (scene, toysGroup) => {
	genToyXY(posT);
	gameState.toy = scene.physics.add.sprite(
		Math.floor((posT.x - 1/2) * gameState.corridorSize),
		Math.floor((posT.y - 1/2) * gameState.corridorSize),
		'snakehead').setScale(0.5);
}

function updateState() {

	// Definition of the baby's next move
	updateMove(gameState.baby, state[0].direction);
	updatePosition(state[0],state[0].direction);
	const debug = [
		"Information:",
		"x : " + state[0].x,
		"y : " + state[0].y,
		]
	
	// If the snake moves (is not eating), we update the positions of the body
	if (gameState.move) {
		const superToys = gameState.toys.getChildren();
		for (let i = 1 ; i < state.length ; i++) {
			updateMove(superToys[i-1],state[i].direction);
			updatePosition(state[i],state[i].direction);
		}
	}
	// debug
	let top = "posT : x = " + posT.x + ", y = " + posT.y + "\n";
	for(let i = 0; i<state.length; i++) {
		top = top + "{x: " + state[i].x + ", y: " + state[i].y + ", direction: " + state[i].direction + " }\n";
		// alert("Whaat ?");
	}
	// The direction in which the toys move has to be updated no matter what
	for (let i = 1 ; i < state.length ; i++) {
		state[i].direction = state[i-1].direction;
	}
	
	// The snake eats something
	if (state[0].x === posT.x && state[0].y === posT.y) {
		gameState.toys.add(gameState.toy);
		state.unshift({x: state[0].x, y: state[0].y, direction: state[0].direction});
		gameState.move = false;
		genToy();
	} else {
		gameState.move = true;
	}

	gameState.information.setText(top);
	
}
  
function update(){
	if (gameState.cursors.right.isDown && gameState.direct !== "left"){
		state[0].direction = "right";
	}
	if (gameState.cursors.left.isDown && gameState.direct !== "right"){
		state[0].direction = "left";
	}
	if (gameState.cursors.down.isDown && gameState.direct !== "up"){
		state[0].direction = "down";
	}
	if (gameState.cursors.up.isDown && gameState.direct !== "down"){
		state[0].direction = "up";
	}
	this.physics.world.wrap(gameState.baby);
	this.physics.world.wrap(gameState.toys);
}

function render(){
	
}


const updateMove = (body, direction) => {

	if (direction === "right") {
		body.setVelocity(gameState.speed, 0);
		gameState.direct = "right";
	}
	if (direction === "left") {
		body.setVelocity(-gameState.speed, 0);
		gameState.direct = "left";
	}
	if (direction === "up") {
		body.setVelocity(0, -gameState.speed);
		gameState.direct = "up";
	}
	if (direction === "down") {
		body.setVelocity(0, gameState.speed);
		gameState.direct = "down";
	}
}

const updatePosition = (position, direction) => {
	if (direction === "right") {
		position.x++;
	}
	if (direction === "left") {
		position.x--;
	}
	if (direction === "up") {
		position.y--;
	}
	if (direction === "down") {
		position.y++;
	}
	if (position.x > gameState.xMax){
		position.x = position.x - gameState.xMax;
	} else if (position.x < 1) {
		position.x = position.x + gameState.xMax;
	}
	
	if (position.y > gameState.yMax){
		position.y = position.y - gameState.yMax;
	} else if (position.y < 1) {
		position.y = position.y + gameState.yMax;
	}

}