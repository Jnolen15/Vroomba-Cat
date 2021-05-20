class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Display menu text
        this.add.text(game.config.width/2, game.config.height/2, "Vroomba Cat", textConfig).setOrigin(0.5);
        let startButton = this.add.text(game.config.width/2, game.config.height/1.75, "Start Game", textConfig).setOrigin(0.5);
        let tutorialButton = this.add.text(game.config.width/2, game.config.height/1.55, "Tutorial", textConfig).setOrigin(0.5);
        
        // Adding buttons to the main menu
        startButton.setInteractive();
        tutorialButton.setInteractive();

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