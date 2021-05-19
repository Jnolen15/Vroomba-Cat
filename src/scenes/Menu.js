class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){ // WE SHOULD MAKE A LOAD SCENE BEFORE THE MENU SCENE
        // Add images
        this.load.image('cat', './assets/placeholder_CAT.png');
        this.load.image('platform', './assets/placeholder_Platform.png');
        this.load.image('prop', './assets/prop_cup.png');
        this.load.image('comboMeter', './assets/placeholder_comboMeter.png');
        this.load.image('debris', './assets/prop_dust.png');
        // Add audio
        this.load.audio('a1', './assets/audio_1.mp3');
        this.load.audio('a2', './assets/audio_2.mp3');
        this.load.audio('a3', './assets/audio_3.mp3');
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Display menu text
        this.add.text(game.config.width/2, game.config.height/2, "Vroomba Cat", textConfig).setOrigin(0.5);
        // this.add.text(game.config.width/2, game.config.height/1.75, "Press ↑ to go to Play Scene", textConfig).setOrigin(0.5);
        let startButton = this.add.text(game.config.width/2, game.config.height/1.75, "Start Game", textConfig).setOrigin(0.5);
        let tutorialButton = this.add.text(game.config.width/2, game.config.height/1.55, "Tutorial", textConfig).setOrigin(0.5);
        
        // Adding buttons to the main menu
        startButton.setInteractive();
        tutorialButton.setInteractive();

        // Interaction controls for both buttons
        startButton.on("pointerover", () => { startButton.setBackgroundColor("green");})
        startButton.on("pointerout", () => { startButton.setBackgroundColor("yellow");})
        startButton.on("pointerup", () => {
            this.scene.start('playScene');  
            game.settings = { gameTimer: 60000 }
        })
        tutorialButton.on("pointerover", () => { tutorialButton.setBackgroundColor("green"); })
        tutorialButton.on("pointerout", () => { tutorialButton.setBackgroundColor("yellow");})
        tutorialButton.on("pointerup", () => { 
            this.scene.start('tutorialScene'); 
            game.settings = { gameTimer: 60000 }
        })
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            this.scene.start('playScene');  
            game.settings = { 
                gameTimer: 60000 
            }  
        }
    }
}