// This object defines some global parameters
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

// The variables that will be used during the game
let snake;
let food;
let cursors;
let debugMess;

// Main game parameters

const config = {
    type : Phaser.AUTO,
	width: gameState.corridorSize * gameState.xMax,
	height: gameState.corridorSize * gameState.yMax,
	backgroundColor: 0x000000,//0xdda0dd,
	parent: "game", // Check for the game id in snake.html
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
	}
}

// Start of instance
const game = new Phaser.Game(config);

function preload() {
	this.load.image('snakehead', 'Game/assets/snakehead.png');
}


function create(){

    // Definition of class snake
    let Snake = new Phaser.Class({
        
        initialize:

        function Snake(scene, x, y) {
            this.headPosition = new Phaser.Geom.Point(x,y);
            this.bodyPosition = [];
            this.bodyDirection = [];
            this.alive = true;
            this.head = scene.physics.add.sprite(
                Math.floor((x - 1/2) * gameState.corridorSize),
                Math.floor((y - 1/2) * gameState.corridorSize),
                'snakehead').setScale(0.8);
            this.body = scene.physics.add.group();

            this.heading = "right";
            this.direction = "right";
            this.eating = false;
        },

        // Method to change the direction of the velocity vector and update the position 
        // of a sub element of the snake (head or body segment)
        moveUnit:

        function(segment, segmentPosition, heading)
        {   
            switch(heading)
            {
                case "left":
                segment.setVelocity(-gameState.speed, 0);
                segmentPosition.x = wrap(segmentPosition.x - 1, 1, gameState.xMax+1);
                break;
        
                case "right":
                segment.setVelocity(gameState.speed, 0);
                segmentPosition.x = wrap(segmentPosition.x + 1, 1, gameState.xMax+1);
                break;
        
                case "up":
                segment.setVelocity(0, -gameState.speed);
                segmentPosition.y = wrap(segmentPosition.y - 1, 1, gameState.yMax+1);
                break;
        
                case "down":
                segment.setVelocity(0, gameState.speed);
                segmentPosition.y = wrap(segmentPosition.y + 1, 1, gameState.yMax+1);
                break;
            }
            return heading;

        },

        grow:

        function(food) 
        {
            let x = Math.floor((food.x - 1/2) * gameState.corridorSize);
            let y = Math.floor((food.y - 1/2) * gameState.corridorSize);

            // Creation of the new body part where the food was
            let newSegment = this.body.create(x,y,'snakehead');
            newSegment.setScale(0.6);
            // Update the bodyPosition array
            this.bodyPosition.push({x: food.x, y: food.y});

            // Update the bodyDirection array
            this.bodyDirection.push(this.direction);
        },

        bodyPause:

        function()
        {
            let segments = this.body.getChildren();
            for(let i = 0; i<segments.length; i++)
            {
                segments[i].setVelocity(0,0);
            }
        },

        moveBody:

        function() 
        {
            const segments = this.body.getChildren();
            const l = segments.length;

            // The segments of the body are updated from the tail to the near head
            // (0 = tail, l-1 is the last body segment before the head) 
            for(let i = 0; i<l-1 ; i++)
            {
                this.bodyDirection[i] = this.moveUnit(segments[i], this.bodyPosition[i], this.bodyDirection[i+1]);
            }
            
            if (l !== 0)
            {
                this.bodyDirection[l-1] = this.moveUnit(segments[l-1], this.bodyPosition[l-1], this.direction);
            }

        }
        
    });

    let Food = new Phaser.Class({

        initialize:

        function Food(scene, x, y)
        {
            this.x = x;
            this.y = y;
            this.body = scene.physics.add.sprite(
                Math.floor((x - 1/2) * gameState.corridorSize),
                Math.floor((y - 1/2) * gameState.corridorSize),
                'snakehead').setScale(0.7);
        },

        updatePosition:

        function(vector)
        {
            this.x = vector.x;
            this.y = vector.y;
            this.body.x = Math.floor((this.x - 1/2) * gameState.corridorSize);
            this.body.y = Math.floor((this.y - 1/2) * gameState.corridorSize);
        }
    });


    // Creation of the games objects
    snake = new Snake(this, gameState.xInit, gameState.yInit);
    food = new Food(this, 3, 4);

    // Creation of the inputs for the gamer
    cursors = this.input.keyboard.createCursorKeys();

    // Creation of the time loop to ensure that the snake moves at regular intervals and stays inside its line
    let t = Math.floor(gameState.corridorSize*1000/gameState.speed);

    //debug section
    let message = "";
    debugMess = this.add.text(10,10,message);

    gameState.timedLoop = this.time.addEvent({ delay: t, callback: updateState, callbackScope: snake, loop: true });

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
    this.physics.world.wrap(snake.head);

}

const updateState = () =>
{   
    // Is the position of the head the same as the food ?
    snake.eating = (snake.headPosition.x === food.x & snake.headPosition.y === food.y);

    // If the snake is eating it is growing
    if (snake.eating)
    {
        snake.bodyPause();
        snake.grow(food);
        let vec = genXY(snake);
        food.updatePosition(vec);
    } else 
    {
        // If it's not eating, the body follows the head
        snake.moveBody();
    }
    
    // The head is moving anyway
    snake.direction = snake.moveUnit(snake.head, snake.headPosition, snake.heading);

    // debug section
    let message = "{Vx: " + snake.head.body.velocity.x + ", Vy: " + snake.head.body.velocity.y + "}\n";
    let segments = snake.body.getChildren();
    for(let i = 0; i < segments.length ; i++)
    {
        message += "{V" + (i+1) + "x: " + segments[i].body.velocity.x + ", V" + (i+1) + "y: " + segments[i].body.velocity.y + "}\n";
    }
    // debugMess.setText(message);
}

const wrap = (value, min, max) => {
    let range = max - min;
    return (min + ((((value - min) % range) + range) % range));
};

const genXY = (snake) => {
	let empty = false;
	let i = 0;
	let X = 0;
    let Y = 0;
    let l = snake.bodyPosition.length;
	while (!empty)
	{
		empty = true;
		X = Math.floor(Math.random()*(gameState.xMax))+1;
		Y = Math.floor(Math.random()*(gameState.yMax))+1;
		while( i < l && empty === true)
		{
			if (snake.bodyPosition[i].x === X && snake.bodyPosition[i].y === Y)
			{
				empty = false;
			}
			i++;
		}
    }
    return {x: X, y: Y};
};
// const genToyXY = (toy)=>{
// 	let empty = false;
// 	let i = 0;
// 	let x = 0;
// 	let y = 0;
// 	while (!empty)
// 	{
// 		empty = true;
// 		x = Math.floor(Math.random()*(gameState.xMax))+1;
// 		y = Math.floor(Math.random()*(gameState.yMax))+1;
// 		while( i < state.length && empty === true)
// 		{
// 			if (state[i].x === x && state[i].y === y)
// 			{
// 				empty = false;
// 			}
// 			i++;
// 		}
// 	}
// 	toy.x = x;
// 	toy.y = y;
// }
