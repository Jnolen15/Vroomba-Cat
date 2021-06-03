class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload(){        
        // Load Json file
        this.load.tilemapTiledJSON('tutorial', './assets/tilemap/tm_tutorial.json');
        // Load Spritesheet
        this.load.image('furniture2', './assets/tilemap/ts_furniture2.png');
        this.load.image('collision', './assets/tilemap/ts_collision.png');
        this.load.image('wallpaper', './assets/tilemap/ts_wallpaper.png');
        this.load.image('hints', './assets/tilemap/ts_hints.png');
    }
    
    create() {
        // Set world bounds
        this.physics.world.setBounds(0,0,5250,657);
        
        //Create the tilemap
        const map = this.add.tilemap('tutorial');

        // Scale of tilemap
        const tmScale = 0.35;

        // add a tileset to the map
        const tsFurniture2 = map.addTilesetImage('ts_furniture2', 'furniture2');
        const tsCollision = map.addTilesetImage('ts_collision', 'collision');
        const tsWallpaper = map.addTilesetImage('ts_wallpaper', 'wallpaper');
        const tsHints = map.addTilesetImage('ts_hints', 'hints');

        // create tilemap layers
        const WallpaperLayer = map.createLayer('bkgLayer', tsWallpaper, 0, 0);
        WallpaperLayer.setScale(tmScale);

        const HintLayer = map.createLayer('hintLayer', tsHints, 0, 0);
        HintLayer.setScale(tmScale);
        
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
                //if(Tile.index!=-1)console.log(Tile.index);
			})
		});

        // Add controller
        this.controller = new Controller(this, CollisionLayer);

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
        this.controller.scene.cameras.main.setBounds(0,0,5250,657);

        // Get Player add text
        this.vroombaCat = this.controller.cat.body;
        this.tutorialText = this.add.text(this.controller.cat.body.x, this.controller.cat.body.y, "Use ←→ or A/D to move.", textConfig).setOrigin(0.5);
        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.totalobjs = numObjs;
    }

    update(time, delta) {
        this.controller.update(time, delta);
        this.tutorialText.setPosition(this.vroombaCat.x + this.vroombaCat.width/2, this.vroombaCat.y - 100);
        if(this.vroombaCat.x > 0 && this.vroombaCat.x < 700) {
            this.tutorialText.setText("Use ←→ or A/D to move.");
        }
        else if(this.vroombaCat.x > 700 && this.vroombaCat.x < 900) {
            this.tutorialText.setText("Use ↑ or W to Jump!");
        }
        else if(this.vroombaCat.x > 900 && this.vroombaCat.x < 1200) {
            this.tutorialText.setText("↑/W twice to Double Jump");
        }
        else if(this.vroombaCat.x > 1200 && this.vroombaCat.x < 2400) {
            this.tutorialText.setText("Drive into objects \n to DESTROY them!");
            if(numObjs < this.totalobjs-2) {
                this.tutorialText.setText("Drive over dust \n for a speed boost!");
            }
        }
        else if(this.vroombaCat.x > 2400 && this.vroombaCat.x < 3000) {
            this.tutorialText.setText("Mash ↓ or S to \n destroy BIG objects!");
        }
        else if(this.vroombaCat.x > 3000 && this.vroombaCat.x < 3500) {
            this.tutorialText.setText("Jump & hit ↓ or S to destroy \nclocks and get a free jump!");
        }
        else if(this.vroombaCat.x > 3500 && this.vroombaCat.x < 4000) {
            this.tutorialText.setText("Destroying objects consecutively \n builds up your streak.\n A higher streak gets you \na point multiplier!");
        }
        else if(this.vroombaCat.x > 4000) {
            this.tutorialText.setText("Press (M)enu (P)lay!");
            if(Phaser.Input.Keyboard.JustDown(this.keyM)) this.scene.start("menuScene");
            else if(Phaser.Input.Keyboard.JustDown(this.keyP)) {
                game.settings = { gameTimer: 30000 }
                this.scene.start("playScene");
            }
        }
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