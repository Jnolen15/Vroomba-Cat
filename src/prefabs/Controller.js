class Controller {
    constructor(scene, tmcol){
        this.scene = scene;
        this.tmcol = tmcol; // Tile map collision
        // Create Cat (Player)
        this.cat = new Cat(scene, game.config.width/2, game.config.height/2, 'anim_move_atlas', 'animation_idle_1').setOrigin(0,0);
        //this.cat.body.setSize(250, 350);
        this.spawner = new Spawner(scene, this.cat, this.tmcol);

        // Collision with player
        this.scene.physics.add.collider(this.cat, this.tmcol);

        // Set up cursor keys
        cursors = scene.input.keyboard.createCursorKeys();
        this.keyM = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // Camera Follower Setup
        scene.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
        scene.cameras.main.setZoom(1.5);
        this.camFollowX = scene.cameras.main.scrollX;
        this.camFollowY = scene.cameras.main.scrollY;
        this.camXFollowRate = .0095;
        this.camYFollowRate = .0075;

        // Game ending clock system
        if(!speedrunMode){
            let menuText1 = scene.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            let menuText2 = scene.add.text(game.config.width/2, game.config.height/2 + 64, 'Press M for Menu', textConfig).setOrigin(0.5);
            this.positionUIForCam(menuText1, menuText1.x, menuText1.y);
            this.positionUIForCam(menuText2, menuText2.x, menuText2.y);
            menuText1.alpha = 0; 
            menuText2.alpha = 0;

            this.clock = scene.time.delayedCall(game.settings.gameTimer, () => {
                menuText1.alpha = 1;
                menuText2.alpha = 1;
                gameOver = true;
                this.cat.fadevac();
            }, null, this);
        } else {
            this.timedEvent = this.scene.time.addEvent({ delay: 6000000, callback: this.onClockEvent, callbackScope: this, repeat: 1 });
            this.minutes = 0;
            this.seconds = 0;
            this.endText1 = this.scene.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.endText2 = this.scene.add.text(game.config.width/2, game.config.height/2 + 64, 'FINAL TIME: ' + '0' + ':' + '0', textConfig).setOrigin(0.5);
            this.endText3 = this.scene.add.text(game.config.width/2, game.config.height/2 + 128, 'Press M for Menu', textConfig).setOrigin(0.5);
            this.positionUIForCam(this.endText1, this.endText1.x, this.endText1.y);
            this.positionUIForCam(this.endText2, this.endText2.x, this.endText2.y);
            this.positionUIForCam(this.endText3, this.endText3.x, this.endText3.y);
            this.endText1.alpha = 0; 
            this.endText2.alpha = 0;
            this.endText3.alpha = 0;
        }

        

        // Score setup
        this.score = 0;
        this.isScoring = false;
        this.currCombo = 0;
        this.prevCombo = 0;
        this.scoreMulti = 1;
        this.prevMulti = 1;
        this.maxScoreTime = 2000;
        this.currScoreTime = 0;
        
        // --- Setting up UI backside art
        let UICenterX = game.config.width * .18;
        let UICenterY = game.config.height * .9;
        // timer art
        if (!speedrunMode) {
            this.timerArt = scene.add.sprite(20, 10, 'timer_back').setOrigin(0,0);
        } else {
            this.timerArt = scene.add.sprite(20, 10, 'speedtimer_back').setOrigin(0,0);
        }
        this.timerArt.setScale(.6);
        this.positionUIForCam(this.timerArt);
        // score counters art
        this.scoreCountersArt = scene.add.sprite(UICenterX, UICenterY, 'scorecounters_back');
        this.scoreCountersArt.setScale(.6);
        this.positionUIForCam(this.scoreCountersArt);
        // multiplier backside art
        this.multiplier_back = scene.add.sprite(UICenterX, UICenterY, 'multiplier_back');
        this.multiplier_back.setScale(.6);
        this.positionUIForCam(this.multiplier_back);
        // combo meter backside
        this.comboMeter_back = scene.add.sprite(UICenterX + 34, UICenterY + 29, 'combometer_back');
        this.comboMeter_back.setScale(.6);
        this.positionUIForCam(this.comboMeter_back);

        // --- Setting up UI combo meter lights
        this.comboMeter_front = scene.add.sprite(UICenterX + 34, UICenterY + 28, 'combometer_front');
        this.comboMeter_front.setScale(.6);
        this.positionUIForCam(this.comboMeter_front);

        // --- Setting up UI text
        // clock timer art
        this.timerText = scene.add.text(129, 29, 'Time: ', timerTextConfig);
        this.positionUIForCam(this.timerText, game.config.width * .05, game.config.height * .05);
        // score text
        this.scoreText = scene.add.text(UICenterX - 65, UICenterY - 45, '0', scoreTextConfig);
        this.positionUIForCam(this.scoreText);
        // streak text
        this.comboText = scene.add.text(UICenterX - 160, UICenterY + 11, '0', messyTextConfig);
        this.positionUIForCam(this.comboText);
        // multiplier text
        this.multText = scene.add.text(UICenterX + 35, UICenterY - 60, 'x1', messyTextConfig);
        this.multText.setFontSize(50);
        this.positionUIForCam(this.multText);
    }


    update(time, delta) {
        // Trigger game ending if in speedrunmode
        if(speedrunMode && numObjs <= 0 && !gameOver){
            gameOver = true;
            this.cat.fadevac();
            //var elapsedtime = this.timedEvent.getElapsedSeconds().toString();
            //this.minutes = Math.floor(elapsedtime / 60);
            //this.seconds = Phaser.Math.RoundTo(elapsedtime - (minutes * 60), -2);
            this.endText2.setText('FINAL TIME: ' + this.minutes + ':' + this.seconds);
            this.endText1.alpha = 1; 
            this.endText2.alpha = 1;
            this.endText3.alpha = 1;
        }
        
        // If the game is over and the player hits keyLeft go to the main menu
        if(gameOver && Phaser.Input.Keyboard.JustDown(this.keyM)) {
            gameOver = false;
            this.scene.scene.start('menuScene'); 
        }

        // Update Player Cat
        if(!gameOver) {
            this.cat.update();
        }
        else {
            this.cat.stopCat();
        }


        // Update Game Score;
        this.manageScore(time, delta);
        
        // Update Game UI
        this.updateUI();
        
        // Update Camera Follower
        this.camFollowPlayer(time, delta);
    }

    camFollowPlayer(time, delta) {
        // Make camera 'catch up' to player gradually with linear interpolation
        this.camFollowX = Phaser.Math.Linear(this.camFollowX, (this.cat.x) - game.config.width/2, this.camXFollowRate * delta);
        this.camFollowY = Phaser.Math.Linear(this.camFollowY, (this.cat.y) - game.config.height/2, this.camYFollowRate * delta);
        this.scene.cameras.main.setScroll(this.camFollowX, this.camFollowY);
        this.scene.cameras.main.update(time, delta);
    }

    addToScore(points) {
        // add to score
        this.score += points * this.scoreMulti;
        this.currCombo++;
        //console.log(this.currScoreTime * 0.001);
        // Scaling Sound
        if((1 + (this.currCombo * 0.05)) < 2.5) this.soundmod = 1 + (this.currCombo * 0.05);
        else this.soundmod = 2.5;
        this.point = this.scene.sound.add('Point', { 
            mute: false,
            volume: 1,
            rate: this.soundmod
        });
        this.point.play();
        
        // change multiplier to what's appropriate 
        if (this.currCombo <= 5) {
            this.scoreMulti = 1;
        } else if (this.currCombo <= 19) {
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

        // Managing combo meter cat paw lights
        // this.comboMeter_front.frame.cutWidth = this.comboMeter_front.frame.width * this.inverseLerp(this.currScoreTime, 0, this.maxScoreTime);
        this.comboMeter_front.setCrop(0,0, this.comboMeter_front.frame.width * this.inverseLerp(this.currScoreTime, 0, this.maxScoreTime), this.comboMeter_front.height);
        // console.log(this.comboMeter_front.frame.cutWidth);
    }

    updateUI() {
        if(!speedrunMode){
            // Update timer text
            var remaining_time = Phaser.Math.RoundTo((this.clock.delay - this.clock.elapsed)/1000,2, 1);
            this.timerText.setText(remaining_time);
        } else if (!gameOver) {
            var elapsedtime = this.timedEvent.getElapsedSeconds().toString();
            this.minutes = Math.floor(elapsedtime / 60);
            this.seconds = Phaser.Math.RoundTo(elapsedtime - (this.minutes * 60), -2);
            this.timerText.setText(this.minutes + ':' + this.seconds);
        }

        // Update score text
        this.scoreText.setText(this.score);
        if(this.prevMulti != this.scoreMulti){
            this.multText.setText("x" + this.scoreMulti);
            this.multText.y -= 25;
            this.scene.tweens.add({ 
                targets: this.multText,
                y: "+=25",
                ease: 'Linear', 
                duration: 50, 
            });
            this.prevMulti = this.scoreMulti;
        }
        if(this.comboText.y > 596) {this.comboText.y = 596; console.log('HERE:' + this.comboText.y)}
        if(this.prevCombo != this.currCombo){
            this.comboText.setText(this.currCombo);
            this.comboText.y -= 25;
            this.scene.tweens.add({ 
                targets: this.comboText,
                y: "+=25",
                ease: 'Linear', 
                duration: 50, 
            });
            this.prevCombo = this.currCombo;
        }
        
        // score multiplier visibility
        if (this.scoreMulti > 1) {
            this.multiplier_back.alpha = 1;
            this.multText.alpha = 1;
        } else {
            this.multiplier_back.alpha = 0;
            this.multText.alpha = 0;
        }

        // score multiplier color 
        if (this.scoreMulti == 3) {
            this.comboText.setColor("orange");
            this.multText.setColor("orange");
        } else if (this.scoreMulti == 2) {
            this.comboText.setColor("yellow");
            this.multText.setColor("yellow");
        } else {
            this.comboText.setColor("white");
            this.multText.setColor("white");
        }
    }

    positionUIForCam(object) {
        object.x = (this.camFollowX + game.config.width/2) 
        - ((game.config.width/2) * 1/this.scene.cameras.main.zoom) + (object.x * 1/this.scene.cameras.main.zoom);
        object.y = (this.camFollowY + game.config.height/2) 
        - ((game.config.height/2) * 1/this.scene.cameras.main.zoom) + (object.y * 1/this.scene.cameras.main.zoom);
        object.setScale(1/this.scene.cameras.main.zoom * object.scale);
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