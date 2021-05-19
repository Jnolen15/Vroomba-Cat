let config = {
    type: Phaser.CANVAS,
    width: 1024,
    height: 768,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 0},
        }
    },
    scene: [Menu, Play, Tutorial],
}

// basic text configuration for rest of coding
let textConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'center',
    padding: {
    top: 5,
    bottom: 5,
    },
    fixedWidth: 0
}

//define game
let game = new Phaser.Game(config);

//Game over boolean
let gameOver = false;

//define globals
let cursors;