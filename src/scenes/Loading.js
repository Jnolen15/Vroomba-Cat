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
        // Add UI images
        this.load.image('combometer_back', './assets/ui_comboMeter_back.png');
        this.load.image('combometer_front', './assets/ui_comboMeter_front.png');
        this.load.image('scorecounters_back', './assets/ui_counters_back.png');
        this.load.image('multiplier_back', './assets/ui_multiplier_back.png');
        this.load.image('debris', './assets/prop_dust.png');
        // Menu Background
        this.load.image('bg', './assets/static_menubackground.png');
        // Props
        this.load.image('p_cup', './assets/prop_cup.png');
        this.load.image('p_apple', './assets/prop_apple.png');
        this.load.image('p_frame', './assets/prop_frame.png');
        this.load.image('p_fruitbowl', './assets/prop_fruitbowl.png');
        this.load.image('p_pencilcup', './assets/prop_pencilcup.png');
        this.load.image('p_spoons', './assets/prop_spoons.png');
        // Big Props
        this.load.image('p_fishbowl', './assets/prop_fishbowl.png');
        this.load.image('p_lamp1', './assets/prop_lamp1.png');
        // Wall Props
        this.load.image('p_wallclock', './assets/prop_wallclock.png');
        // Debris
        this.load.image('debris', './assets/prop_dust.png');
        this.load.image('poof', './assets/prop_poof.png');
        this.load.image('shard', './assets/prop_shard.png');
        // Add sprites via sprite atlas
        this.load.atlas('anim_move_atlas', './assets/anim_moveFLIPPED.png', './assets/anim_move.json');
        this.load.atlas('anim_kickflip_atlas', './assets/anim_kickflip.png', './assets/anim_kickflip.json');
        this.load.atlas('anim_swipe_atlas', './assets/anim_swipe.png', './assets/anim_swipe.json');
        // Add audio
        this.load.audio('Hit1', './assets/sounds/Hit1.mp3');
        this.load.audio('Hit2', './assets/sounds/Hit2.mp3');
        this.load.audio('Lift1', './assets/sounds/Lift1.mp3');
        this.load.audio('Lift2', './assets/sounds/Lift2.mp3');
        this.load.audio('Swipe', './assets/sounds/Swipe.mp3');
        this.load.audio('Thump1', './assets/sounds/Thump1.mp3');
        this.load.audio('Thump2', './assets/sounds/Thump2.mp3');
        this.load.audio('VacOn', './assets/sounds/VacOn.mp3');
        this.load.audio('VacStart', './assets/sounds/VacStart.mp3');
        this.load.audio('VacStop', './assets/sounds/VacStop.mp3');
        this.load.audio('VacUp', './assets/sounds/VacUp.mp3');
        this.load.audio('Woosh1', './assets/sounds/Woosh1.mp3');
        this.load.audio('Woosh2', './assets/sounds/Woosh2.mp3');
        this.load.audio('Woosh3', './assets/sounds/Woosh3.mp3');
        this.load.audio('Point', './assets/sounds/Point.wav');
        this.load.audio('Select', './assets/sounds/Select.wav');
        this.load.audio('Start', './assets/sounds/Start.wav');
        this.load.audio('Break1', './assets/sounds/Break1.mp3'); // From https://freesound.org/people/Nox_Sound/sounds/554367/
        this.load.audio('Break2', './assets/sounds/Break2.mp3'); // From https://freesound.org/people/Nox_Sound/sounds/554367/
        this.load.audio('Break3', './assets/sounds/Break3.mp3'); // From https://freesound.org/people/InspectorJ/sounds/352208/
        this.load.audio('Break4', './assets/sounds/Break4.mp3'); // From https://freesound.org/people/sandyrb/sounds/148074/
        this.load.audio('music', './assets/sounds/bg_music.mp3'); // From https://snapmuse.com/

    }

    create() {
        // --- Setup Animations
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
        // air_jumping
        this.anims.create({
            key: 'air_jumping_animation',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNames('anim_kickflip_atlas', {
                prefix: 'kickflip_',
                suffix: "",
                start: 1,
                end: 2
            })
        });
        // air_rising
        this.anims.create({
            key: 'air_rising_animation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNames('anim_kickflip_atlas', {
                prefix: 'kickflip_',
                suffix: "",
                start: 2,
                end: 2
            })
        });
        // air_falling
        this.anims.create({
            key: 'air_falling_animation',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNames('anim_kickflip_atlas', {
                prefix: 'kickflip_',
                suffix: "",
                start: 5,
                end: 5
            })
        });
        // air_lightLanding
        this.anims.create({
            key: 'air_lightLanding_animation',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNames('anim_kickflip_atlas', {
                prefix: 'kickflip_',
                suffix: "",
                start: 6,
                end: 6
            })
        });
        // air_hardLanding
        this.anims.create({
            key: 'air_hardLanding_animation',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNames('anim_kickflip_atlas', {
                prefix: 'kickflip_',
                suffix: "",
                start: 6,
                end: 7
            })
        });
        // air_kickFlipping
        this.anims.create({
            key: 'air_kickFlipping_animation',
            frameRate: 10,
            repeat: 0,
            frames: [
                {key: 'anim_kickflip_atlas', frame: 'kickflip_3'}, 
                {key: 'anim_kickflip_atlas', frame: 'kickflip_4'},
                {key: 'anim_kickflip_atlas', frame: 'kickflip_3'},
                {key: 'anim_kickflip_atlas', frame: 'kickflip_4'}
            ]
        });
        // swiping 
        this.anims.create({
            key: 'swiping_animation',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNames('anim_swipe_atlas', {
                prefix: 'swipe',
                suffix: ".png",
                start: 1,
                end: 2
            })
        });

        // Start scene
        this.scene.start('menuScene');
    }
}