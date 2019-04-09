const gameState = {};

function create() {
	this.add.text(20, 20, "Hello World");
}

const config = {
	type: Phaser.WEBGL,
	width: 600,
	height: 600,
	backgroundColor: 0xdda0dd,
	parent: "game",
	scene: {
		create
	}
};

const game = new Phaser.Game(config);