class Controller {
    constructor(scene){
        this.scene = scene;
        // Create Cat (Player)
        this.cat = new Cat(scene, game.config.width/2, game.config.height/2, 'cat').setOrigin(0,0);
        this.spawner = new Spawner(scene, this.cat);
        this.spawner.createPlatform('platform', game.config.width/2, game.config.height, 8, 1);

        // Set up cursor keys
        cursors = scene.input.keyboard.createCursorKeys();

        // Camera Follower Setup
        scene.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        scene.cameras.main.setZoom(1.3);
        this.camFollowX = scene.cameras.main.scrollX;
        this.camFollowY = scene.cameras.main.scrollY;
        this.camFollowRate = .0045;

        // Game ending clock system
        let menuText1 = scene.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
        let menuText2 = scene.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ↓ for Menu', textConfig).setOrigin(0.5);
        this.positionUIForCam(menuText1, menuText1.x, menuText1.y);
        this.positionUIForCam(menuText2, menuText2.x, menuText2.y);
        menuText1.alpha = 0; 
        menuText2.alpha = 0;

        this.clock = scene.time.delayedCall(10000, () => {
            menuText1.alpha = 1;
            menuText2.alpha = 1;
            gameOver = true;
        }, null, this);

        // Displaying clock timer
        this.timerText = scene.add.text(0, 0, 'Time: ', textConfig).setOrigin(0);
        this.positionUIForCam(this.timerText, game.config.width * .05, game.config.height * .05);

        // Score setup
        this.score = 0;
        this.isScoring = false;
        this.currCombo = 0;
        this.scoreMulti = 1;
        this.defaultPoints = 5;
        this.maxScoreTime = 3000;
        this.currScoreTime = 0;
        this.scoreText = scene.add.text(0, 0, 'Score: ', textConfig).setOrigin(1,0);
        this.positionUIForCam(this.scoreText, game.config.width * .95, game.config.height * .05);

        // Displaying combo meter
        this.comboText = scene.add.text(0, 0, 'Streak: 0 - Multiplier: x1', textConfig).setOrigin(1,0);
        this.positionUIForCam(this.comboText, game.config.width * .95, game.config.height * .1);
        this.comboMeter = scene.add.sprite(0, 0, 'comboMeter').setOrigin(1,0);
        this.positionUIForCam(this.comboMeter, game.config.width * .95, game.config.height * .2);
    }


    update(time, delta) {
        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && cursors.down.isDown) {
            gameOver = false;
            this.scene.scene.start('menuScene'); 
        }

        // Update Player Cat
        if(!gameOver) this.cat.update();

        // Update Game Score;
        this.manageScore(time, delta);
        
        // Update Game UI
        this.updateUI();
        
        // Update Camera Follower
        this.camFollowPlayer(time, delta);
    }

    camFollowPlayer(time, delta) {
        // Make camera 'catch up' to player gradually with linear interpolation
        this.camFollowX = Phaser.Math.Linear(this.camFollowX, (this.cat.x) - game.config.width/2, this.camFollowRate * delta);
        this.camFollowY = Phaser.Math.Linear(this.camFollowY, (this.cat.y) - game.config.height/2, this.camFollowRate * delta);
        this.scene.cameras.main.setScroll(this.camFollowX, this.camFollowY);
        this.scene.cameras.main.update(time, delta);
    }

    addToScore() {
        // add to score
        this.score += this.defaultPoints * this.scoreMulti;
        this.currCombo++;
        
        // change multiplier to what's appropriate 
        if (this.currCombo <= 2) {
            this.scoreMulti = 1;
        } else if (this.currCombo <= 4) {
            this.scoreMulti = 2;
        } else {
            this.scoreMulti = 3;
        }

        this.isScoring = true;
    }

    manageScore(time, delta) {
        if (this.isScoring) {
            // restart the countdown
            this.currScoreTime = this.maxScoreTime;
            this.isScoring = false;
        } else {
            if (this.currScoreTime <= 0) {
                // player failed: reset combo meter
                this.currCombo = 0;
                this.scoreMulti = 1;
            } else {
                // tick down countdown
                this.currScoreTime -= delta;
            }
        }
        this.comboMeter.frame.cutWidth = this.comboMeter.frame.width * this.inverseLerp(this.currScoreTime, 0, this.maxScoreTime);
    }

    updateUI() {
        // Update timer text
        var remaining_time = Phaser.Math.RoundTo((this.clock.delay - this.clock.elapsed)/1000,2, 1);
        this.timerText.setText('Time: ' + remaining_time);

        // Update score text
        this.scoreText.setText('Score: ' + this.score);
        this.comboText.setText('Streak: ' + this.currCombo + ' - Multiplier: x' + this.scoreMulti);
        if (this.scoreMulti > 1) {
            this.comboText.setBackgroundColor('#fff000');
        } else {
            this.comboText.setBackgroundColor('#F3B141');
        }
    }

    positionUIForCam(object, x, y) {
        object.x = (this.camFollowX + game.config.width/2) 
        - ((game.config.width/2) * 1/this.scene.cameras.main.zoom) + (x * 1/this.scene.cameras.main.zoom);
        object.y = (this.camFollowY + game.config.height/2) 
        - ((game.config.height/2) * 1/this.scene.cameras.main.zoom) + (y * 1/this.scene.cameras.main.zoom);
        object.setScale(1/this.scene.cameras.main.zoom);
        object.setDepth(2);
        object.setScrollFactor(0);
    }

    // Borrowed from our earlier project: Ourobor-Bus
    // https://github.com/Jnolen15/Ourobor-Bus/blob/3b92bf10df4dd1091e1d03ed25cb90443aa9ab5e/src/scenes/play.js#L499
    inverseLerp(point, a, b)
    {
        if (a == b && point >= b) {
            return 1.0;
        }
        else if (a == b && point < b) {
            return 0.0;
        }
        
        point = Phaser.Math.Clamp(point, a, b);
        if (point == a)
            return 0.0;
        else if (point == b)
            return 1.0;
        else {
            let d = b - a;
            let f = b - point;
            return (d - f) / d;
        }
    }
}