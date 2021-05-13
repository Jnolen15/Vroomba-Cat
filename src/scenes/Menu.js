class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.image('cat', './assets/placeholder_CAT.PNG');
        this.load.image('platform', './assets/placeholder_Platform.PNG');
        this.load.image('prop', './assets/prop_cup.PNG');
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Display menu text
        this.add.text(game.config.width/2, game.config.height/2, "Menu", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.75, "Press ↑ to go to Play Scene", textConfig).setOrigin(0.5);

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