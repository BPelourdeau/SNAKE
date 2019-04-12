const gameState = {};

const config = {
	type: Phaser.WEBGL,
	width: 600,
	height: 600,
	backgroundColor: 0xdda0dd,
	parent: "game",
	physics: {
		default: 'arcade',
			arcade: {
            debug: true
            }
        },
	scene: {
		preload,
		create,
		update
	}
};

const game = new Phaser.Game(config);

function preload() {
	this.load.image('snakehead', 'Game/assets/snakehead.png');
}

function create(){
	gameState.snakeHead = this.physics.add.sprite(300, 300,'snakehead');
	gameState.cursors = this.input.keyboard.createCursorKeys();
	gameState.direct = "right";
	gameState.speed = 100;//means x pixel/sec
	gameState.snakeHead.setVelocityX(gameState.speed);
	gameState.snakeHead.setCollideWorldBounds(true);
	gameState.timedLoop = this.time.addEvent({ delay: Math.floor(20*1000/gameState.speed), callback: updateDirection, callbackScope: this, loop: true });
  }
  
function updateDirection() {
	if (gameState.direct === "right"){
		gameState.snakeHead.setVelocityY(0);
		gameState.snakeHead.setVelocityX(gameState.speed);
	}
	if (gameState.direct === "left"){
		gameState.snakeHead.setVelocityY(0);
		gameState.snakeHead.setVelocityX(-gameState.speed);
	}
	if (gameState.direct === "down"){
		gameState.snakeHead.setVelocityX(0);
		gameState.snakeHead.setVelocityY(gameState.speed);
	}
	if (gameState.direct === "up"){
		gameState.snakeHead.setVelocityX(0);
		gameState.snakeHead.setVelocityY(-gameState.speed);
	}
	
}
  
function update(){
	if (gameState.cursors.right.isDown){
		gameState.direct = "right";
	}
	if (gameState.cursors.left.isDown){
		gameState.direct = "left";
	}
	if (gameState.cursors.down.isDown){
		gameState.direct = "down";
	}
	if (gameState.cursors.up.isDown){
		gameState.direct = "up";
	}
}

