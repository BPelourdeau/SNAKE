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

let snake;
let food;
let cursors;
let debugMess;

const config = {
    type : Phaser.AUTO,
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
		update
	}
}

const game = new Phaser.Game(config);

function preload() {
	this.load.image('snakehead', 'Game/assets/snakehead.png');
}

function create(){

    let Snake = new Phaser.Class({
        
        initialize:

        function Snake(scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x,y);
            this.alive = true;
            this.body = scene.physics.add.group();
            this.head = scene.physics.add.sprite(
                Math.floor((x - 1/2) * gameState.corridorSize),
                Math.floor((y - 1/2) * gameState.corridorSize),
                'snakehead').setScale(0.6);
            this.body.add(this.head);

            this.heading = "right";
            this.direction = "right";
            this.eating = false;
        }
        
    });

    let Food = new Phaser.Class({

        initialize:

        function Food(scene, x, y)
        {
            this.body = scene.physics.add.sprite(
                Math.floor((x - 1/2) * gameState.corridorSize),
                Math.floor((y - 1/2) * gameState.corridorSize),
                'snakehead').setScale(0.8);
        }
    });

    snake = new Snake(this, gameState.xInit, gameState.yInit);
    food = new Food(this, 3, 4);
    cursors = this.input.keyboard.createCursorKeys();
    debugMess = this.add.text(10, 10, "First");

    gameState.timedLoop = this.time.addEvent({ delay: Math.floor(gameState.corridorSize*1000/gameState.speed), callback: updateState, callbackScope: snake, loop: true });

}

function update(time, delta){

    // gestion des inputs
    if (cursors.left.isDown && snake.direction !== "right")
    {
        snake.heading = "left";
    }
    if (cursors.right.isDown && snake.direction !== "left")
    {
        snake.heading = "right";
    }
    if (cursors.up.isDown && snake.direction !== "down")
    {
        snake.heading = "up";
    }
    if (cursors.down.isDown && snake.direction !== "up")
    {
        snake.heading = "down";
    }

    this.physics.world.wrap(snake.body);

}

const updateState = () =>
{

    if(!snake.eating)
    {
        const segments = snake.body.getChildren();
        // debugMess.setText("segments length : " + segments.length);
        for(let i = 1; i < segments.length ; i++)
        {
            segments[i].setVelocity(segments[i-1].body.velocity.x,segments[i-1].body.velocity.y);
        }
    }
    switch(snake.heading)
    {
        case "left":
        snake.head.setVelocity(-gameState.speed, 0);
        snake.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, gameState.xMax);
        break;

        case "right":
        snake.head.setVelocity(gameState.speed, 0);
        snake.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, gameState.xMax);
        break;

        case "up":
        snake.head.setVelocity(0, -gameState.speed);
        snake.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, gameState.yMax);
        break;

        case "down":
        snake.head.setVelocity(0, gameState.speed);
        snake.headPosition.x = Phaser.Math.Wrap(this.headPosition.y + 1, 0, gameState.yMax);
        break;

    }
    snake.direction = snake.heading;
}
