import "Phaser";

const gameState = {
	score: 0,
	xInit: 7,
	yInit: 7,
	xMax: 15,
	yMax: 15,
	corridorSize: 20,
	speed: 100 //means x pixels/sec
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

const pos = {
	x: [],
	y: []
};

const game = new Phaser.Game(config);

function preload() {
	this.load.image('snakehead', 'Game/assets/snakehead.png');
}

function create(){
	gameState.baby = this.physics.add.sprite(
		Math.floor((gameState.xInit - 1/2) * gameState.corridorSize),
		Math.floor((gameState.yInit - 1/2) * gameState.corridorSize),
		'snakehead').setScale(0.6);
	gameState.cursors = this.input.keyboard.createCursorKeys();
	gameState.direct = "right";
	gameState.baby.setCollideWorldBounds(false);
	pos.x[0] = gameState.xInit;
	pos.y[0] = gameState.yInit;
	gameState.toys = this.add.group();
	const vec = genToysXY();
	gameState.toy = this.physics.add.sprite(
		Math.floor((vec[0] - 1/2) * gameState.corridorSize),
		Math.floor((vec[1] - 1/2) * gameState.corridorSize),
		'snakehead').setScale(0.5);
	gameState.information = this.add.text(10,10,"Information:", { color: '#ffffff' });
	gameState.timedLoop = this.time.addEvent({ delay: Math.floor(20*1000/gameState.speed), callback: updateDirection, callbackScope: this, loop: true });
  }
  
const genToysXY = ()=>{
	let empty = false;
	let i = 0;
	let x = 0;
	let y = 0;
	while (!empty)
	{
		empty = true;
		x = Math.floor(Math.random()*(gameState.xMax))+1;
		y = Math.floor(Math.random()*(gameState.yMax))+1;
		while( i < pos.x.length && empty === true)
		{
			if (pos.x[i] === x && pos.y[i] === y)
			{
				empty = false;
			}
			i++;
		}
	}
	return [x,y];
}
  
function updateDirection() {
	if (gameState.direct === "right"){
		gameState.baby.setVelocityY(0);
		gameState.baby.setVelocityX(gameState.speed);
		pos.x[0] += 1;
	}
	if (gameState.direct === "left"){
		gameState.baby.setVelocityY(0);
		gameState.baby.setVelocityX(-gameState.speed);
		pos.x[0] -= 1;
	}
	if (gameState.direct === "down"){
		gameState.baby.setVelocityX(0);
		gameState.baby.setVelocityY(gameState.speed);
		pos.y[0] += 1;
	}
	if (gameState.direct === "up"){
		gameState.baby.setVelocityX(0);
		gameState.baby.setVelocityY(-gameState.speed);
		pos.y[0] -= 1;
	}
	if (pos.x[0] > gameState.xMax){
		pos.x[0] = pos.x[0] - gameState.xMax;
	} else if (pos.x[0] < 1) {
		pos.x[0] = pos.x[0] + gameState.xMax;
	}
	
	if (pos.y[0] > gameState.yMax){
		pos.y[0] = pos.y[0] - gameState.yMax;
	} else if (pos.y[0] < 1) {
		pos.y[0] = pos.y[0] + gameState.yMax;
	}
	
	for(let i = 1; i < pos.x.length ; i++)
	{
		pos.x[i] = pos.x[i-1];
		pos.y[i] = pos.y[i-1];
	}
	const debug = [
	"Information:",
	"x : " + pos.x,
	"y : " + pos.y,
	"toyX:" + gameState.toy.x,
	"toyY:" + gameState.toy.y
	]
	gameState.information.setText(debug);
	
}
  
function update(){
	if (gameState.cursors.right.isDown && gameState.direct !== "left"){
		gameState.direct = "right";
	}
	if (gameState.cursors.left.isDown && gameState.direct !== "right"){
		gameState.direct = "left";
	}
	if (gameState.cursors.down.isDown && gameState.direct !== "up"){
		gameState.direct = "down";
	}
	if (gameState.cursors.up.isDown && gameState.direct !== "down"){
		gameState.direct = "up";
	}
	this.physics.world.wrap(gameState.baby);
}

function render(){
	
}

