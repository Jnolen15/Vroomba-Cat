class Speedrun extends Phaser.Scene {
    constructor() {
        super("speedrunScene");
    }

    preload(){        
        // Load Json file
        this.load.tilemapTiledJSON('speedrun', './assets/tilemap/tm_speedrun.json');
        // Load Spritesheet
        this.load.image('furniture2', './assets/tilemap/ts_furniture2.png');
        this.load.image('collision', './assets/tilemap/ts_collision.png');
        this.load.image('wallpaper', './assets/tilemap/ts_wallpaper.png');
        this.load.image('shadows', './assets/tilemap/ts_shadows.png');
    }
    
    create() {
        // Set world bounds
        this.physics.world.setBounds(0,0,2625,1313);
        
        //Create the tilemap
        const map = this.add.tilemap('speedrun');

        // Scale of tilemap
        const tmScale = 0.35;

        // add a tileset to the map
        const tsFurniture2 = map.addTilesetImage('ts_furniture2', 'furniture2');
        const tsCollision = map.addTilesetImage('ts_collision', 'collision');
        const tsWallpaper = map.addTilesetImage('ts_wallpaper', 'wallpaper');
        const tsShadows = map.addTilesetImage('ts_shadows', 'shadows');

        // create tilemap layers
        const WallpaperLayer = map.createLayer('bkgLayer', tsWallpaper, 0, 0);
        WallpaperLayer.setScale(tmScale);

        const ShadowsLayer = map.createLayer('shadowLayer', tsShadows, 0, 0);
        ShadowsLayer.setScale(tmScale);
        
        const FurnitureLayer = map.createLayer('furnitureLayer', tsFurniture2, 0, 0);
        FurnitureLayer.setScale(tmScale);
        
        const CollisionLayer = map.createLayer('collisionLayer', tsCollision, 0, 0);
        CollisionLayer.setScale(tmScale);
        CollisionLayer.alpha = 0;

        const objectsLayer = map.getObjectLayer('objectsLayer')['objects'];
        //objectsLayer.setScale(tmScale);

        // Collision
        CollisionLayer.setCollisionFromCollisionGroup();
        // This part of code from https://www.html5gamedevs.com/topic/40484-jump-through-a-tile-from-underneath/
        CollisionLayer.layer.data.forEach((row) => { // here we are iterating through each tile.
			row.forEach((Tile) => {
                if(Tile.index==951){ 
                    Tile.collideDown = false;
                    Tile.collideLeft = false;
                    Tile.collideRight = false;
                }
			})
		});

        // Add controller
        this.controller = new Controller(this, CollisionLayer, "speedrun");

        // Spawning objects
        objectsLayer.forEach(object => { // here we are iterating through each object.
			switch(object.name) {
                case 'obj':
                    this.controller.spawner.createProp(this.randProp(), object.x*tmScale, object.y*tmScale, 0.5, CollisionLayer);
                    numObjs++;
                    break;
                case 'big':
                    this.controller.spawner.createBigProp(this.randBigProp(), object.x*tmScale, object.y*tmScale, 0.5, CollisionLayer);
                    numObjs++;
                    break;
                case 'wall':
                    this.controller.spawner.createAirProp(this.randWallProp(), object.x*tmScale, object.y*tmScale, 0.5, CollisionLayer);
                    numObjs++;
                    break;
                case 'spawn':
                    this.controller.cat.y = object.y * tmScale;    
                    this.controller.cat.x = object.x * tmScale;
                default: break;
            }
		});

        // Set camera to world bounds
        this.controller.scene.cameras.main.setBounds(0,0,2625,1313);
    }

    update(time, delta) {
        this.controller.update(time, delta);
    }

    randProp(){
        const props = ['p_cup', 'p_apple', 'p_frame', 'p_fruitbowl', 'p_pencilcup', 'p_spoons'];
        var rand = Phaser.Math.Between(0,5);
        return props[rand];
    }

    randBigProp(){
        const bigProps = ['p_fishbowl', 'p_lamp1'];
        var rand = Phaser.Math.Between(0,1);
        return bigProps[rand];
    }

    randWallProp(){
        const wallProps = ['p_wallclock'];
        var rand = Phaser.Math.Between(0,0);
        return wallProps[rand];
    }
}