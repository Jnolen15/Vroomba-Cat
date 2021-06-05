class Cat extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); // don't go out of the map

        // Cat properties
        this.moveSpeed = 20;            // On ground move speed
        this.moveSpeedMax = 500;        // On ground Max move speed
        this.turboMoveSpeed = 30;       // On ground TURBO move speed
        this.turboMoveSpeedMax = 700;   // On ground TURBO Max move speed
        this.inTurboMode = false;       // Boolean for turbo mode
        this.numJumps = 2;              // Number of jumps the player currently has
        this.totalJumps = 2;            // Total number of jumps the player has
        this.jumpSpeed = 525;           // Jump speed / height
        this.doubleSpeed = 350;         // Jump speed / height of second jump
        this.airBrake = 10;             // Air Braking
        this.groundBrake = 25;          // Ground Braking
        this.airSpeed = 20;             // How much in air controll the player has
        this.airSpeedMax = 400;         // Upper bound for in air speed
        this.setGravityY(1000);
        this.setDepth(1);
        this.setScale(.2);

        // animation variables
        this.movementStage = 'idle';    // | idle | moving | airRising | airKickFlipping | airFalling
        this.fallVelocityThresh = 1;    // How fast must the cat be falling for the squish landing animation
        this.riseVelocityThresh = 0;    // How fast must the cat be falling for the squish landing animation
        this.play('idle_stationary_animation');

        //this.setCircle(60, 10);

        // Add extra hitboxes
        this.swipeBox = new Phaser.Physics.Arcade.Sprite(scene, x, y);
        scene.physics.add.existing(this.swipeBox);
        this.swipeBox.setBodySize(this.width*this.scale, this.height*this.scale);

        // Setup keys
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyDOWN = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // Vaccuum Noise
        this.vac = scene.sound.add('VacOn', { 
            mute: false,
            volume: 0,
            rate: 1,
            loop: true 
        });
        this.vac.play();
        //scene.sound.play('VacStart', { volume: 0.03 });
        scene.tweens.add({
            targets: this.vac,
            volume: 0.025,
            ease: 'Linear',
            duration: 1000,
        });
        
        // Particles
        let dustparticleConfig = {
            blendmode: 'ADD',
            scale: {min: 0.1, max: 0.2},
            rotate: {min: 0, max: 360},
            alpha: {start: 1, end: 0},
            lifespan: {min: 1000, max: 1500},
            gravityY: 20,
            on: false,
        }

        this.dustTrial = this.scene.add.particles('poof');
        this.dustTrial.depth = 0;
        this.dustemitter = this.dustTrial.createEmitter(dustparticleConfig);
    }

    update(){
        // Reset speed if not in turbo mode
        if(!this.inTurboMode){
            if(this.body.velocity.x > this.moveSpeedMax) this.body.velocity.x = this.moveSpeedMax;
            else if(this.body.velocity.x < -this.moveSpeedMax) this.body.velocity.x = -this.moveSpeedMax;
        }
        
        if(this.body.blocked.down){
            // left/right movement on ground
            if(this.numJumps != this.totalJumps) this.playRandSound(['Thump1', 'Thump2'], 0.4);
            this.numJumps = this.totalJumps; // Replenish jumps when on the ground
            if(cursors.left.isDown || this.keyA.isDown) {
                if(this.body.velocity.x > -this.moveSpeedMax) this.body.velocity.x -= this.moveSpeed;
                this.flipX = true;
                this.doMovementAnim();
            } else if(cursors.right.isDown || this.keyD.isDown) {
                if(this.body.velocity.x < this.moveSpeedMax) this.body.velocity.x += this.moveSpeed;
                this.flipX = false;
                this.doMovementAnim();
            } else {
                if(this.body.velocity.x > 0) this.body.velocity.x -=this.groundBrake;
                else if(this.body.velocity.x < 0) this.body.velocity.x +=this.groundBrake;
                this.doIdleAnimation();

                if(this.body.velocity.x > -20 && this.body.velocity.x < 20) {
                    // stopping completely 
                    this.body.velocity.x = 0;
                }
            }
        } else {
            this.doAirAnimation();
            // If player went off an edge without jumping first remove a jump.
            if(this.numJumps == this.totalJumps) this.numJumps -= 1;
            // In air movement controll
            if((cursors.left.isDown || this.keyA.isDown) && this.body.velocity.x > -this.airSpeedMax) { // Holding left
                this.body.velocity.x -= this.airSpeed;
                this.flipX = true;
            } else if((cursors.right.isDown || this.keyD.isDown) && this.body.velocity.x < this.airSpeedMax) { // Holding right
                this.body.velocity.x += this.airSpeed;
                this.flipX = false;
            }
            // Airbraking. loose horizontal velocity while in air
            else if(this.flipX && this.body.velocity.x < 0) this.body.velocity.x += this.airBrake;   //Left
            else if (this.body.velocity.x > 0) this.body.velocity.x -= this.airBrake;           //Right
        }

        // jump
        if((Phaser.Input.Keyboard.JustDown(this.keyUP) || Phaser.Input.Keyboard.JustDown(this.keyW)) && this.numJumps > 0){
            if(this.numJumps == this.totalJumps){ // First jump
                this.numJumps -= 1;
                this.body.velocity.y = -this.jumpSpeed;
                this.playRandSound(['Lift1', 'Lift2'], 0.4);
            } else { // Second jump
                this.numJumps -= 1;
                this.body.velocity.y = -this.doubleSpeed; // Less powerful
                this.doKickFlipAnimation();
                this.playRandSound(['Woosh1', 'Woosh2', 'Woosh3'], 2);
            }
        }

        // Swipe (Just the animation and sound)
        if(Phaser.Input.Keyboard.JustDown(this.keyS) || Phaser.Input.Keyboard.JustDown(this.keyDOWN)){
            this.scene.sound.play('Swipe', { volume: 2 });
            this.doSwipeAnimation();
        }

        // --- manage swipe hitbox position
        this.swipeBox.body.x = this.flipX ? this.body.x - (this.width * this.scale) / 2 : this.body.x + (this.width * this.scale) / 2;
        this.swipeBox.body.y = this.body.y;

        // Speed boost particles
        if(this.inTurboMode){
            this.dustTrial.emitParticleAt(this.x+40, this.y+60, 1);
        }
    }

    stopCat() {
        if(this.body.blocked.down){
            // if the cat is grounded — slow it down
            if(this.body.velocity.x > 0)
                this.body.velocity.x -=this.groundBrake;
            else if (this.body.velocity.x < 0)
                this.body.velocity.x +=this.groundBrake;
            
            // if within a threshhold — stop completely
            if(this.body.velocity.x > -20 && this.body.velocity.x < 20)
                this.body.velocity.x = 0;

            this.doIdleAnimation();
        } else {
            // if the cat is airborne — the falling anim until you hit the ground
            this.doAirAnimation();
        }
    }

    fadevac(){
        this.scene.tweens.add({
            targets: this.vac,
            volume: 0.0,
            ease: 'Linear',
            duration: 1000,
        });
    }

    turboChargeCat(scene) {
        this.moveSpeed = this.turboMoveSpeed;
        this.moveSpeedMax = this.turboMoveSpeedMax;
        this.inTurboMode = true;
        // Game ending clock system
        this.clock = scene.time.delayedCall(1000, () => {
            this.moveSpeed = 20;
            this.moveSpeedMax = 500;
            this.inTurboMode = false;
        }, null, this);
    }

    playRandSound(sounds, volume){
        var rand = Phaser.Math.Between(0,sounds.length-1);
        this.scene.sound.play(sounds[rand], { volume: volume });
    }

    // Animations
    doMovementAnim() {
        if (this.movementStage == 'idle') {
            // play the start up animation
            this.movementStage = 'moving';
            this.play('ground_startMove_animation', true);
            this.on('animationcomplete', () => {
                // do this looping movement animation afterwards
                this.play('ground_moving_animation', true);
            });
        } else if (this.movementStage == 'airRising') {
            // player was just airborn, play landing animation
            this.movementStage = 'moving';
            this.play('air_lightLanding_animation', true);
            this.on('animationcomplete', () => {
                // do this looping movement animation afterwards
                this.play('ground_moving_animation', true);
            });
        } else if (this.movementStage == 'airFalling') {
            // player was just airborn, play landing animation
            this.movementStage = 'moving';
            this.play('air_hardLanding_animation', true);
            this.on('animationcomplete', () => {
                // do this looping movement animation afterwards
                this.play('ground_moving_animation', true);
            });
        }
    }

    doIdleAnimation() {
        if (this.movementStage == 'moving') {
            // player was just moving; play the slow down animation
            this.movementStage = 'idle';
            this.play('idle_slowing_animation', true);
            this.on('animationcomplete', () => {
                // loop the full stop animation afterwards
                this.play('idle_stationary_animation', true);
            });
        } else if (this.movementStage == 'airRising') {
            // player was just in the air; play landing animation 
            this.movementStage = 'idle';
            this.play('air_lightLanding_animation', true);
            this.on('animationcomplete', () => {
                // loop the full stop animation afterwards
                this.play('idle_stationary_animation', true);
            });
        } else if (this.movementStage == 'airFalling') {
            // player was just in the air; play landing animation 
            this.movementStage = 'idle';
            this.play('air_hardLanding_animation', true);
            this.on('animationcomplete', () => {
                // loop the full stop animation afterwards
                this.play('idle_stationary_animation', true);
            });
        }
    }

    doAirAnimation() {
        if (this.movementStage == 'moving' || this.movementStage == 'idle') {
            // player is initiating a jump, play jump intro
            this.movementStage = 'airRising';
            this.play('air_jumping_animation', true);
            this.on('animationcomplete', () => {
                // loop the full stop animation afterwards
                this.play('air_rising_animation', true);
            });
        } else if (this.movementStage == 'airRising') {
            // player is currently airborn
            if (this.body.velocity.y > this.fallVelocityThresh) { // postive means falling
                // if the player is airborn but falling
                this.movementStage = 'airFalling';
                this.play('air_falling_animation', true);
            }
        } else if (this.movementStage == 'airFalling') {
            // player is currently airborn
            if (this.body.velocity.y < this.riseVelocityThresh) { // negative means rising
                // if the player starts rising again after falling
                this.movementStage = 'airRising';
                this.play('air_rising_animation', true);
            }
        }
    }

    doKickFlipAnimation() {
        // play the kick flip animation
        this.movementStage = 'airRising';
        this.play('air_kickFlipping_animation', true);
        this.on('animationcomplete', () => {
            // transition to rising again
            this.play('air_rising_animation', true);
        });
    }

    doSwipeAnimation() {
        // play the swipe animation
        this.play('swiping_animation', true);
    }

}