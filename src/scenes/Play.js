class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Create Cat (Player)
        this.cat = new Cat(this, game.config.width/2, game.config.height/2, 'cat').setOrigin(0,0);

        // Set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Game ending clock system
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ↓ for Menu', textConfig).setOrigin(0.5);
            gameOver = true;
        }, null, this);
        this.timeElapsed = this.add.text(80, 40, 'Time: ' + Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1), textConfig).setOrigin(0.5);

        // Add platforms (Should find a better way to make the game map for the future)
        this.platformGroup = this.physics.add.group();
        this.platform1 = this.physics.add.sprite(game.config.width/2, game.config.height/2 + 200, "platform");
        this.platformGroup.add(this.platform1);
        this.platform1.setImmovable(true);

        // Add collider between platformGroup and Cat
        this.physics.add.collider(this.cat, this.platformGroup);
        this.physics.add.overlap(this.cat, this.platformGroup, function(cat, platform) {
            isGrounded = true;
        });

        console.log("isGrounded: " + isGrounded);
    }

    update() {
        //Update timer text
        var remaining_time = (this.game.settings.gameTimer/1000) - Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1);
        this.timeElapsed.setText('Time: ' + remaining_time);

        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && cursors.down.isDown) {
            this.scene.start('menuScene'); 
        }

        // Update Player Cat
        if(!gameOver) this.cat.update();
    }
}