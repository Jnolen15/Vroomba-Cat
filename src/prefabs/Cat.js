class Cat extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); // don't go out of the map

        // Cat properties
        this.moveSpeed = 500;       // On ground move speed
        this.numJumps = 2;          // Number of jumps the player currently has
        this.totalJumps = 2;        // Total number of jumps the player has
        this.jumpSpeed = 500;       // Jump speed / height
        this.doubleSpeed = 400;     // Jump speed / height of second jump
        this.airBrake = 10;         // Air Braking
        this.groundBrake = 25;         // Ground Braking
        this.airSpeed = 20;         // How much in air controll the player has
        this.airSpeedMax = 600;     // Upper bound for in air speed
        this.setGravityY(1000);
        this.setDepth(100);
        this.setScale(0.5);
        this.setBodySize(125, 110);
        //this.setCircle(60, 10);

        // Setup the jump key individually because JustDown does not work the way cursors are set up
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update(){
        //console.log("Velocity: " + this.body.velocity.x);
        // left/right movement on ground
        if(this.body.touching.down){
            this.numJumps = this.totalJumps; // Replenish jumps when on the ground
            if(cursors.left.isDown) {
                this.body.velocity.x = -this.moveSpeed;
                this.flipX = true;
            } else if(cursors.right.isDown) {
                this.body.velocity.x = this.moveSpeed;
                this.flipX = false;
            } else {
                if(this.body.velocity.x > 0) this.body.velocity.x -=this.groundBrake;
                else if(this.body.velocity.x < 0) this.body.velocity.x +=this.groundBrake;

                if(this.body.velocity.x > -20 && this.body.velocity.x < 20) this.body.velocity.x = 0;
            }
        } else {
            // console.log(this.body.velocity.x);
            // Airbraking. loose horizontal velocity while in air
            if(this.flipX && this.body.velocity.x < 0) this.body.velocity.x += this.airBrake;   //Left
            else if (this.body.velocity.x > 0) this.body.velocity.x -= this.airBrake;           //Right
            // If player went off an edge without jumping first remove a jump.
            if(this.numJumps == this.totalJumps) this.numJumps -= 1;
            // In air movement controll
            if(cursors.left.isDown && this.body.velocity.x > -this.airSpeedMax) { // Holding left
                this.body.velocity.x -= this.airSpeed;
                this.flipX = true;
                console.log(this.body.velocity.x);
            } else if(cursors.right.isDown && this.body.velocity.x < this.airSpeedMax) { // Holding right
                this.body.velocity.x += this.airSpeed;
                this.flipX = false;
                console.log(this.body.velocity.x);
            }
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

    }

    turboChargeCat(scene) {
        this.moveSpeed = 1000;
        // Game ending clock system
        this.clock = scene.time.delayedCall(1000, () => {
            this.moveSpeed = 500;
        }, null, this);
    }
}