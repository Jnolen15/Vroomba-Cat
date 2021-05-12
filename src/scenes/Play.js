class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Create Cat (Player)
        this.cat = new Cat(this, game.config.width/2, game.config.height/2, 'cat').setOrigin(0,0);
        this.cat.setScale(0.5);

        // Set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Game ending clock system
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ↓ for Menu', textConfig).setOrigin(0.5);
            gameOver = true;
        }, null, this);
        this.timeElapsed = this.add.text(80, 40, 'Time: ' + Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1), textConfig).setOrigin(0.5);

        // Add platform group (Should find a better way to make the game map for the future)
        this.platformGroup = this.physics.add.group();

        // Add collider between platformGroup and Cat
        this.physics.add.collider(this.cat, this.platformGroup);

        // Add platforms
        this.platform = this.platformGroup.create(game.config.width/2, game.config.height, "platform");
        this.platform.scaleX = 8;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(700, 400, "platform");
        this.platform.scaleX = 4;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(100, 300, "platform");
        this.platform.scaleX = 3;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(300, 540, "platform");
        this.platform.scaleX = 2;
        this.platform.setImmovable(true);

        // Camera Follower Setup
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.setZoom(1.3);
        this.camFollowX = this.cameras.main.scrollX;
        this.camFollowY = this.cameras.main.scrollY;
        this.camFollowRate = .0045;
    }

    update(time, delta) {
        //Update timer text
        var remaining_time = (this.game.settings.gameTimer/1000) - Phaser.Math.RoundTo(this.clock.elapsed/1000,2, 1);
        this.timeElapsed.setText('Time: ' + remaining_time);

        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && cursors.down.isDown) {
            gameOver = false;
            this.scene.start('menuScene'); 
        }

        // Update Player Cat
        if(!gameOver) this.cat.update();

        // Update Camera Follower
        this.camFollowPlayer(delta);
    }

    camFollowPlayer(delta) {
        // Make camera 'catch up' to player gradually with linear interpolation
        this.camFollowX = Phaser.Math.Linear(this.camFollowX, (this.cat.x)- game.config.width/2, this.camFollowRate * delta);
        this.camFollowY = Phaser.Math.Linear(this.camFollowY, (this.cat.y)- game.config.height/2, this.camFollowRate * delta);
        this.cameras.main.setScroll(this.camFollowX, this.camFollowY);
    }
}