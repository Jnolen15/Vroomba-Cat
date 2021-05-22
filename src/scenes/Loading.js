class Loading extends Phaser.Scene {
    constructor() {
        super("loadingScene");
    }

    preload() {
        // --- Loading-visual setup
        var loadingBar = this.add.image(game.config.width / 2,game.config.height / 2,'loadingBar');
        var loadingText = this.make.text({
            x: game.config.width*.5,
            y: game.config.height*.5,
            text: 'Loading...',
            style: {
                font: '25px Courier',
                fill: '#b3cfdd'
            }
        }).setOrigin(.5);
        loadingText.setOrigin(0.5, 0.5);
        // loading-event listeners
        this.load.on('progress', function (value) {
            loadingBar.frame.cutWidth = loadingBar.frame.width * value;
        });            
        this.load.on('complete', function () {
            loadingBar.destroy();
            loadingText.destroy();
        });

        // --- Loading data
        // Add images
        this.load.image('cat', './assets/placeholder_cat.png');
        this.load.image('platform', './assets/placeholder_Platform.png');
        this.load.image('prop', './assets/prop_cup.png');
        this.load.image('comboMeter', './assets/placeholder_comboMeter.png');
        this.load.image('debris', './assets/prop_dust.png');
        // Add sprites via sprite atlas
        this.load.atlas('anim_move_atlas', './assets/anim_moveFLIPPED.png', './assets/anim_move.json');
        // Add audio
        this.load.audio('a1', './assets/audio_1.mp3');
        this.load.audio('a2', './assets/audio_2.mp3');
        this.load.audio('a3', './assets/audio_3.mp3');
    }

    create() {
        // --- Setup Animations
        // testing move
        this.anims.create({
            key: 'move_animation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNames('anim_move_atlas', {
                prefix: 'animation_idle_',
                suffix: "",
                start: 1,
                end: 4
            })
        });
        // idle stationary
        this.anims.create({
            key: 'idle_slowing_animation',
            frameRate: 10,
            repeat: 0,
            frames: [{key: 'anim_move_atlas', frame: 'animation_idle_2'}, {key: 'anim_move_atlas', frame: 'animation_idle_1'}]
        });
        this.anims.create({
            key: 'idle_stationary_animation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNames('anim_move_atlas', {
                prefix: 'animation_idle_',
                suffix: "",
                start: 1,
                end: 1
            })
        });
        // ground_startMove
        this.anims.create({
            key: 'ground_startMove_animation',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNames('anim_move_atlas', {
                prefix: 'animation_idle_',
                suffix: "",
                start: 1,
                end: 4
            })
        });
        // ground_moving
        this.anims.create({
            key: 'ground_moving_animation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNames('anim_move_atlas', {
                prefix: 'animation_idle_',
                suffix: "",
                start: 3,
                end: 4
            })
        });

        this.scene.start('menuScene');
    }
}