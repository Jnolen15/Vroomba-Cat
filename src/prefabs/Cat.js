class Cat extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); // don't go out of the map

        // Cat properties
        this.moveSpeed = 500;
        this.jumpSpeed = 500;
        //this.setDragX(800);
        this.setMaxVelocity(380);
        this.setGravityY(500);
    }

    update(){
        // left/right movement
        if(cursors.left.isDown) {
            this.body.velocity.x = -this.moveSpeed;
            this.flipX = true;
        } else if(cursors.right.isDown) {
            this.body.velocity.x = this.moveSpeed;
            this.flipX = false;
        } else {
            this.body.velocity.x = 0; 
        }

        // jump
        if(cursors.up.isDown){
            this.body.velocity.y = -this.moveSpeed;
        }
    }
}