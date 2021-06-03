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
            //debug: true,
            gravity: {y: 0},
        }
    },
    scene: [LoadingPrep, Loading, Menu, Play, Tutorial, Speedrun],
}

// basic text configuration for rest of coding
/*let textConfig = {
    fontFamily: 'Courier',
    fontSize: '24px',
    color: 'white',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 6,
    fill: 'white',
    padding: {
    top: 5,
    bottom: 5,
    },
    wordWrap: {width: 800, useAdvancedWrap: true},
    fixedWidth: 0
}*/

let textConfig = {
    fontFamily: 'edosz',
    fontSize: '24px',
    color: 'white',
    align: 'center',
    stroke: '#598dbe',
    strokeThickness: 6,
    fill: 'white',
    padding: {
    top: 5,
    bottom: 5,
    },
    wordWrap: {width: 800, useAdvancedWrap: true},
    fixedWidth: 0
}

let timerTextConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    color: '#ffffff',
    align: 'left',
    stroke: '#fff',
    strokeThickness: 2,
    padding: {
    top: 5,
    bottom: 5,
    },
    fixedWidth: 170
}

let scoreTextConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    color: '#ffffff',
    align: 'center',
    stroke: '#fff',
    strokeThickness: 2,
    padding: {
    top: 5,
    bottom: 5,
    },
    fixedWidth: 70
}

let messyTextConfig = {
    fontFamily: 'edosz',
    fontSize: '32px',
    color: '#ffffff',
    align: 'center',
    padding: {
    top: 5,
    bottom: 5,
    },
    fixedWidth: 70
}

let tinyScoreConfig = {
    fontFamily: 'edosz',
    fontSize: '24px',
    color: '#ffb300',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 2
}

let tinyMultConfig = {
    fontFamily: 'edosz',
    fontSize: '18px',
    color: '#ff0033',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 2
}

//define game
let game = new Phaser.Game(config);

//Game over boolean
let gameOver = false;
let speedrunMode = false;
let numObjs = 0;

//define globals
let cursors;
let tutorialMedal = 'none';
let timedMedal = 'none';
let speedRunMedal = 'none';