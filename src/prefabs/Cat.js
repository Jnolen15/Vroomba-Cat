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
        this.jumpSpeed = 1000;      // Jump speed / height
        this.airSpeed = 10;         // How much in air controll the player has
        this.airSpeedMax = 600;     // Upper bound for in air speed
        this.setGravityY(1000);

        // Setup the jump key individually because JustDown does not work the way cursors are set up
        this.keyUP = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update(){
        // left/right movement on ground
        if(this.body.touching.down){
            if(cursors.left.isDown) {
                this.body.velocity.x = -this.moveSpeed;
                this.flipX = true;
            } else if(cursors.right.isDown) {
                this.body.velocity.x = this.moveSpeed;
                this.flipX = false;
            } else {
                this.body.velocity.x = 0; 
            }
        } else { // Reduced speed in air movement
            if(cursors.left.isDown && this.body.velocity.x > -this.airSpeedMax) {
                this.body.velocity.x -= this.airSpeed;
                this.flipX = true;
            } else if(cursors.right.isDown && this.body.velocity.x < this.airSpeedMax) {
                this.body.velocity.x += this.airSpeed;
                this.flipX = false;
            }
        }

        // jump
        if(Phaser.Input.Keyboard.JustDown(this.keyUP) && this.body.touching.down){
            this.body.velocity.y = -this.moveSpeed;
        }
    }
}