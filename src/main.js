let config = {
    type: Phaser.CANVAS,
    width: 880,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {x: 0, y: 0},
        }
    },
    scene: [],
}

//define game
let game = new Phaser.Game(config);