class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Display menu text
        this.title = this.add.text(game.config.width/2, game.config.height * .10, "Vroomba Cat", textConfig).setOrigin(0.5);
        this.titleMoveSpeed = 5; this.stop = false; this.title.setDepth(1);
        let startButton = this.add.text(game.config.width/2, game.config.height * .42, "[↑] Start Game", textConfig).setOrigin(0.5);
        let tutorialButton = this.add.text(game.config.width/2, game.config.height * .58, "[↓] Tutorial", textConfig).setOrigin(0.5);
        let quitButton = this.add.text(game.config.width/2 ,game.config.height* .65, "Quit", textConfig).setOrigin(0.5);
        this.modeIndicator = this.add.text(game.config.width/2, game.config.height * .5, "[→] Regular Mode", textConfig).setOrigin(0.5);
        
        // Adding buttons to the main menu
        startButton.setInteractive();
        tutorialButton.setInteractive();
        quitButton.setInteractive();

        // Interaction controls for both buttons
        startButton.on("pointerover", () => { startButton.setBackgroundColor("green");})
        startButton.on("pointerout", () => { startButton.setBackgroundColor(textConfig.backgroundColor);})
        startButton.on("pointerup", () => {
            game.settings = { gameTimer: 30000}
            this.scene.start('playScene');
        })
        tutorialButton.on("pointerover", () => { tutorialButton.setBackgroundColor("green"); })
        tutorialButton.on("pointerout", () => { tutorialButton.setBackgroundColor(textConfig.backgroundColor);})
        tutorialButton.on("pointerup", () => { 
            game.settings = { gameTimer: 600000}
            this.scene.start('tutorialScene');
        })
        quitButton.on("pointerover", () => { quitButton.setBackgroundColor("green");})
        quitButton.on("pointerout", () => { quitButton.setBackgroundColor(textConfig.backgroundColor);})
        quitButton.on("pointerup", () => {
            this.title.alpha = 0;
            startButton.alpha = 0;
            tutorialButton.alpha = 0;
            quitButton.alpha = 0;
            this.modeIndicator.alpha = 0;
            this.troll = this.add.text(game.config.width/2,game.config.height/2, 
                "HA YOU THOUGHT! YOU CAN NEVER QUIT THIS GAME BECAUSE IT IS THE BEST GAME IN THE WORLD!!!" + 
                "REFRESH THIS PAGE NOW AND YOU BETTER ENJOY VROOMBA CAT FOR THE REST OF YOUR LIFE BECAUSE IT IS THE ONLY GAME YOU SHOULD PLAY FROM NOW ON. I WILL ACCEPT NO LESS." +
                "VROOMBA CAT IS THE LIGHT AND IT IS THE SAVIOR. NOW GET BACK TO PLAYING THE GAME CHUMP!", textConfig).setOrigin(0.5);
        })
        this.tweens.add({
            targets: this.title,
            y: game.config.height * .35,
            ease: 'Bounce',
            yoyo: 1,
            repeat: -1,
            hold: 3000,
            duration: 1000,
        });
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)){
            if(!speedrunMode) {
                speedrunMode = true;
                this.modeIndicator.setText("[→] Speed Run Mode");
            }
            else{
                speedrunMode = false;
                this.modeIndicator.setText("[→] Regular Mode");
            } 
            console.log("speedrunMode: " + speedrunMode);
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            game.settings = { gameTimer: 30000}
            this.scene.start('playScene');
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            game.settings = { gameTimer: 600000}
            this.scene.start('tutorialScene');
        }
    }
}