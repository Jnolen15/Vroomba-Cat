class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Create Cat (Player)
        this.cat = new Cat(this, game.config.width/2, game.config.height/2, 'cat').setOrigin(0,0);
        this.spawner = new Spawner(this, this.cat);

        // Set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
        
        // Camera Follower Setup
        this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        this.cameras.main.setZoom(1.3);
        this.camFollowX = this.cameras.main.scrollX;
        this.camFollowY = this.cameras.main.scrollY;
        this.camFollowRate = .0045;

        // Game ending clock system
        let menuText1 = this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
        let menuText2 = this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ↓ for Menu', textConfig).setOrigin(0.5);
        this.positionUIForCam(menuText1, menuText1.x, menuText1.y);
        this.positionUIForCam(menuText2, menuText2.x, menuText2.y);
        menuText1.alpha = 0; 
        menuText2.alpha = 0;
        
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            menuText1.alpha = 1;
            menuText2.alpha = 1;
            gameOver = true;
        }, null, this);
        
        // | Displaying clock timer
        this.timerText = this.add.text(0, 0, 'Time: ', textConfig).setOrigin(.5);
        this.positionUIForCam(this.timerText, game.config.width * .1, game.config.height * .05);
        
        // Score setup
        this.score = 0;
        this.scoreText = this.add.text(0, 0, 'Score: ', textConfig).setOrigin(.5);
        this.positionUIForCam(this.scoreText, game.config.width * .9, game.config.height * .05);
    }

    update(time, delta) {
        if (cursors.down.isDown) {
            console.log(time + " - start of update: " + this.cameras.main.scrollX);
        }
        
        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && cursors.down.isDown) {
            gameOver = false;
            this.scene.start('menuScene'); 
        }

        // Update Player Cat
        if(!gameOver) this.cat.update();

        // Update Game UI
        this.updateUI();
        
        // Update Camera Follower
        this.camFollowPlayer(time, delta);
        if (cursors.down.isDown) {
            console.log(time + " - After camFollow method: " + this.cameras.main.scrollX);
        }
    }

    camFollowPlayer(time, delta) {
        // Make camera 'catch up' to player gradually with linear interpolation
        this.camFollowX = Phaser.Math.Linear(this.camFollowX, (this.cat.x) - game.config.width/2, this.camFollowRate * delta);
        this.camFollowY = Phaser.Math.Linear(this.camFollowY, (this.cat.y) - game.config.height/2, this.camFollowRate * delta);
        this.cameras.main.setScroll(this.camFollowX, this.camFollowY);
        this.cameras.main.update(time, delta);
    }

    addToScore() {
        this.score += 5;
        console.log("current score: " + this.score);
    }

    updateUI() {
        // Update timer text
        var remaining_time = Phaser.Math.RoundTo((this.clock.delay - this.clock.elapsed)/1000,2, 1);
        this.timerText.setText('Time: ' + remaining_time);

        // Update score text
        this.scoreText.setText('Score: ' + this.score);
    }

    positionUIForCam(object, x, y) {
        object.x = (this.camFollowX + game.config.width/2) 
        - ((game.config.width/2) * 1/this.cameras.main.zoom) + (x * 1/this.cameras.main.zoom);
        object.y = (this.camFollowY + game.config.height/2) 
        - ((game.config.height/2) * 1/this.cameras.main.zoom) + (y * 1/this.cameras.main.zoom);
        object.setScale(1/this.cameras.main.zoom);
        object.setDepth(2);
        object.setScrollFactor(0);
    }
}