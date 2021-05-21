class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Display menu text
        this.title = this.add.text(game.config.width/2, 0, "Vroomba Cat", textConfig).setOrigin(0.5);
        this.titleMoveSpeed = 5; this.stop = false; this.title.setDepth(1);
        let startButton = this.add.text(game.config.width/2, game.config.height/1.75, "Start Game", textConfig).setOrigin(0.5);
        let tutorialButton = this.add.text(game.config.width/2, game.config.height/1.55, "Tutorial", textConfig).setOrigin(0.5);
        let quitButton = this.add.text(game.config.width- 75,45, "Quit", textConfig).setOrigin(0.5);

        
        // Adding buttons to the main menu
        startButton.setInteractive();
        tutorialButton.setInteractive();
        quitButton.setInteractive();

        // Interaction controls for both buttons
        startButton.on("pointerover", () => { startButton.setBackgroundColor("green");})
        startButton.on("pointerout", () => { startButton.setBackgroundColor(textConfig.backgroundColor);})
        startButton.on("pointerup", () => {
            this.scene.start('playScene');  
            game.settings = { gameTimer: 60000 }
        })
        tutorialButton.on("pointerover", () => { tutorialButton.setBackgroundColor("green"); })
        tutorialButton.on("pointerout", () => { tutorialButton.setBackgroundColor(textConfig.backgroundColor);})
        tutorialButton.on("pointerup", () => { 
            this.scene.start('tutorialScene'); 
            game.settings = { gameTimer: 60000 }
        })
        quitButton.on("pointerover", () => { quitButton.setBackgroundColor("green");})
        quitButton.on("pointerout", () => { quitButton.setBackgroundColor(textConfig.backgroundColor);})
        quitButton.on("pointerup", () => {
            this.title.Alpha = 0;
            startButton.destroy();
            tutorialButton.destroy();
            quitButton.destroy();
            this.troll = this.add.text(game.config.width/2,game.config.height/2, 
                "HA YOU THOUGHT! YOU CAN NEVER QUIT THIS GAME BECAUSE IT IS THE BEST GAME IN THE WORLD!!!" + 
                "REFRESH THIS PAGE NOW AND YOU BETTER ENJOY VROOMBA CAT FOR THE REST OF YOUR LIFE BECAUSE IT IS THE ONLY GAME YOU SHOULD PLAY FROM NOW ON. I WILL ACCEPT NO LESS." +
                "VROOMBA CAT IS THE LIGHT AND IT IS THE SAVIOR. NOW GET BACK TO PLAYING THE GAME CHUMP!", textConfig).setOrigin(0.5);
        })
    }

    update() {
        if(this.title.y == game.config.height/2) {
            this.titleMoveSpeed = 0;
        }
        else if(!this.stop && this.title.y < game.config.height *0.55) {
            this.title.y += this.titleMoveSpeed;
        }
        else if(this.title.y > game.config.height/2) {
            this.titleMoveSpeed = 1;
            this.stop = true;
            this.title.y -= this.titleMoveSpeed;
        }
    }
}