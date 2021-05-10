class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.playText = this.add.text(game.config.width/2, game.config.height/2, "Play Scene", textConfig).setOrigin(0.5);

        // Game ending clock system
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ← for Menu', textConfig).setOrigin(0.5);
            this.playText.alpha = 0;
            gameOver = true;
        }, null, this);
        this.timeElapsed = this.add.text(game.config.width/2, game.config.height/2.5, 'Time: ' + Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1), textConfig).setOrigin(0.5);

        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        //Update timer text
        var remaining_time = (this.game.settings.gameTimer/1000) - Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1);
        this.timeElapsed.setText('Time: ' + remaining_time);

        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
            this.scene.start('menuScene'); 
        }
    }
}