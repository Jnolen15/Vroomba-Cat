class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.image('cat', './assets/placeholder_CAT.PNG');
        this.load.image('platform', './assets/placeholder_Platform.PNG');
    }

    create() {
        // Set up keys
        cursors = this.input.keyboard.createCursorKeys();

        // Display menu text
        this.add.text(game.config.width/2, game.config.height/2, "Menu", textConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.75, "Press ↑ to go to Play Scene", textConfig).setOrigin(0.5);

    }

    update() {
        if (cursors.up.isDown) {
            this.scene.start('playScene');  
            game.settings = { 
                gameTimer: 60000 
            }  
        }
    }
}