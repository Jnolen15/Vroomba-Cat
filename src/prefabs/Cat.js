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
        this.numJumps = 2;              // Number of jumps the player currently has
        this.totalJumps = 2;            // Total number of jumps the player has
        this.jumpSpeed = 500;           // Jump speed / height
        this.doubleSpeed = 400;         // Jump speed / height of second jump
        this.airBrake = 10;             // Air Braking
        this.groundBrake = 25;          // Ground Braking
        this.airSpeed = 20;             // How much in air controll the player has
        this.airSpeedMax = 400;         // Upper bound for in air speed
        this.setGravityY(1000);
        this.setDepth(1);
        this.setScale(.2);

        // animation variables
        this.movementStage = 'idle';    // | idle | moving |
        this.play('idle_stationary_animation');

        //this.setCircle(60, 10);

        // Add extra hitboxes
        this.swipeBox = new Phaser.Physics.Arcade.Sprite(scene, x, y);
        scene.physics.add.existing(this.swipeBox);
        this.swipeBox.setBodySize(this.width*this.scale, this.height*this.scale);

        // Setup the jump key individually because JustDown does not work the way cursors are set up
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update(){
        if(this.body.blocked.down){
            // left/right movement on ground
            this.numJumps = this.totalJumps; // Replenish jumps when on the ground
            if(cursors.left.isDown) {
                if(this.body.velocity.x > -this.moveSpeedMax) this.body.velocity.x -= this.moveSpeed;
                this.flipX = true;
                this.doMovementAnim();
            } else if(cursors.right.isDown) {
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
            // If player went off an edge without jumping first remove a jump.
            if(this.numJumps == this.totalJumps) this.numJumps -= 1;
            // In air movement controll
            if(cursors.left.isDown && this.body.velocity.x > -this.airSpeedMax) { // Holding left
                this.body.velocity.x -= this.airSpeed;
                this.flipX = true;
            } else if(cursors.right.isDown && this.body.velocity.x < this.airSpeedMax) { // Holding right
                this.body.velocity.x += this.airSpeed;
                this.flipX = false;
            }
            // Airbraking. loose horizontal velocity while in air
            else if(this.flipX && this.body.velocity.x < 0) this.body.velocity.x += this.airBrake;   //Left
            else if (this.body.velocity.x > 0) this.body.velocity.x -= this.airBrake;           //Right
        }

        // jump
        if(Phaser.Input.Keyboard.JustDown(this.keyUP) && this.numJumps > 0){
            if(this.numJumps == this.totalJumps){ // First jump
                this.numJumps -= 1;
                this.body.velocity.y = -this.jumpSpeed;
            } else { // Second jump
                this.numJumps -= 1;
                this.body.velocity.y = -this.doubleSpeed; // Less powerful
            }
        }

        // --- manage swipe hitbox position
        this.swipeBox.body.x = this.flipX ? this.body.x - (this.width * this.scale) / 2 : this.body.x + (this.width * this.scale) / 2;
        this.swipeBox.body.y = this.body.y;
    }

    turboChargeCat(scene) {
        this.moveSpeed = this.turboMoveSpeed;
        this.moveSpeedMax = this.turboMoveSpeedMax;
        console.log("TURBO!!");
        // Game ending clock system
        this.clock = scene.time.delayedCall(1000, () => {
            this.moveSpeed = 20;
            this.moveSpeedMax = 500;
            console.log("End of turbo!!");
        }, null, this);
    }

    doMovementAnim() {
        if (this.movementStage == 'idle') {
            // play the start up animation
            this.movementStage = 'moving';
            this.play('ground_startMove_animation', true);
            this.on('animationcomplete', () => {
                // do this looping animation afterwards
                this.play('ground_moving_animation', true);
            });
        }
    }

    doIdleAnimation() {
        if (this.movementStage == 'moving') {
            // play the start up animation
            this.movementStage = 'idle';
            this.play('idle_slowing_animation', true);
            this.on('animationcomplete', () => {
                // loop the full stop animation afterwards
                this.play('idle_stationary_animation', true);
            });
        }
    }

}