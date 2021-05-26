let config = {
    type: Phaser.CANVAS,
    width: 1024,
    height: 768,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        //mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {y: 0},
        }
    },
    scene: [LoadingPrep, Loading, Menu, Play, Tutorial],
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
    wordWrap: {width: 800, useAdvancedWrap: true},
    fixedWidth: 0
}

let tinyScoreConfig = {
    fontFamily: 'Verdana',
    fontSize: '20px',
    color: '#ffb300',
    align: 'center',
    stroke: '#ffb300',
    strokeThickness: 1.3
}

let tinyMultConfig = {
    fontFamily: 'Verdana',
    fontSize: '14px',
    color: '#ff0033',
    align: 'center',
    stroke: '#ff0033',
    strokeThickness: 1.3
}

//define game
let game = new Phaser.Game(config);

//Game over boolean
let gameOver = false;
let speedrunMode = false;
let numObjs = 0;

//define globals
let cursors;