class Object extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        // Add self 
        scene.add.existing(this);
        
        // Add physics
        scene.physics.add.existing(this);
        // scene.physics.add.collider();
        this.setCollideWorldBounds(true); // don't go out of the map
        this.setGravityY(1000);
    }

}