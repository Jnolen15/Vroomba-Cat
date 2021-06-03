class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        // this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Menu Background
        this.add.image(game.config.width/2,game.config.height/2,'bg').setOrigin(0.5);

        // Display menu text
        //this.title = this.add.text(game.config.width * 0.25, game.config.height * .30, "Vroomba Cat", textConfig).setOrigin(0.5);
        this.startButton = this.add.text(game.config.width * 0.25, game.config.height * .52, "[↑] Play", textConfig).setOrigin(0.5);
        this.tutorialButton = this.add.text(game.config.width * 0.25 , game.config.height * .6, "[↓] Tutorial", textConfig).setOrigin(0.5);
        this.creditButton = this.add.text(game.config.width * 0.25 , game.config.height * .68, "(C) Credits", textConfig).setOrigin(0.5);
        this.regModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↑] Timed Mode", textConfig).setOrigin(0.5);
        this.speedModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↓] Speed Run Mode", textConfig).setOrigin(0.5);
        this.creditsContent = this.add.text(-100, game.config.height * .8, "Jared Nolen\nBenjamin Urlik\n Nathann Latimore\n Danielle Kraljevski", textConfig).setOrigin(0.5);
        this.creditsContent.alpha = 0;
        
        // this.keyF.on('down', function () {
        //     if (this.scale.isFullscreen) { this.scale.stopFullscreen(); }
        //     else { 
        //         this.scale.startFullscreen(); 
        //     }
        // }, this);

        // Load Logo
        this.logo = this.add.image(game.config.width * 0.75, game.config.height * .10, 'logo').setOrigin(0.5);

        // Sets the extra play options to be invisible
        this.regModeButton.alpha = 0;
        this.speedModeButton.alpha = 0;

        // Anchor points for the text
        this.startButtonXAnchor = this.startButton.x;
        this.startButtonXAnim = this.startButton.x + 50;
        this.tutorialButtonXAnchor = this.tutorialButton.x;
        this.tutorialButtonXAnim = this.tutorialButton.x + 50;
        this.regModeButtonXAnchor = this.regModeButton.x;
        this.regModeButtonYAnchor = this.regModeButton.y;
        this.regModeButtonXAnimMoveOutAnchor = this.regModeButton.x + 300;
        this.regModeButtonXAnimMoveInAnchor = this.regModeButton.x + 250;
        this.speedModeButtonXAnchor = this.speedModeButton.x;
        this.speedModeButtonXAnimMoveOutAnchor = this.speedModeButton.x + 300;
        this.speedModeButtonXAnimMoveInAnchor = this.speedModeButton.x + 250;
        this.speedModeButtonYAnchor = this.speedModeButton.y;
        
        // Boolean flags to determine which options are selected
        this.startSelected = false;
        this.tutorialSelected = false;
        this.startModeOptions = false;
        this.regModeSelected = false;
        this.speedModeSelected = false;

        // Jumping title animation
        this.tweens.add({
            targets: this.logo,
            y: this.logo.y + 100,
            ease: 'Bounce',
            yoyo: 1,
            repeat: -1,
            hold: 3000,
            duration: 1000,
        });

        // Background Music
        this.bg_music = this.sound.add('music', {loop: true});
        this.bg_music.play();
        console.log(this.bg_music);
        this.bg_music.volume = 0;

        // Spinning Cat
        this.spinCatMinX = -750;
        this.spinCatMaxX = game.config.width + 750;
        this.spinnningCat = this.add.sprite(this.spinCatMinX, game.config.height*.9, 'anim_spin_atlas', 'spin1.png');
        this.spinnningCat.setScale(.4);
        this.spinnningCat.play('spinning_animation');

        // Spinning Cat Sounds
        this.spinVacuum = this.sound.add('VacOn', { 
            mute: false,
            volume: .06,
            rate: 1,
            loop: true 
        });
        this.spinVacuum.play();

        this.resetFlags();

        // Display medals
        this.displayMedals();

        // Reset numObjs
        numObjs = 0;
    }
    

    update() {  
        // console.log('start: ' + this.startSelected + 
        //             '\ntutorial: ' + this.tutorialSelected +
        //             '\nstartOptions: ' + this.startModeOptions +
        //             '\nregMode: ' + this.regModeSelected +
        //             '\nspeedMode: ' + this.speedModeSelected);

        // Animation for hovering the Start Game Button
        if(!this.startSelected && (Phaser.Input.Keyboard.JustDown(this.keyUP) || Phaser.Input.Keyboard.JustDown(this.keyW))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.tutorialSelected) { 
                this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 200,}); 
                this.tutorialButton.setText("[↓] Tutorial");
            }
            this.tweens.add({ targets: this.startButton, x: this.startButtonXAnim, ease: 'Linear', duration: 200, });
            this.startButton.setText("[→] Play");
            this.startSelected = true;
            this.tutorialSelected = false;
        }

        // Animation for selecting Start Game and receiving game options {Regular Mode vs Speed Run Mode}
        if(this.startSelected && !this.startModeOptions && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x + 250, y: this.regModeButton.y - 50, ease: 'Linear', duration: 200, alpha: 1, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x + 250, y: this.speedModeButton.y + 50, ease: 'Linear', duration: 200, alpha: 1, });
            this.startButton.setText("[←] Play");
            this.startModeOptions = true;
        }

        // Animation for hovering the Regular Mode
        if(this.startModeOptions &&  !this.regModeSelected && (Phaser.Input.Keyboard.JustDown(this.keyUP) || Phaser.Input.Keyboard.JustDown(this.keyW))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.speedModeSelected) { 
                this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnimMoveInAnchor, ease: 'Linear', duration: 200, }); 
                this.speedModeButton.setText("[↓] Speed Run Mode");
            }
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnimMoveOutAnchor, ease: 'Linear', duration: 200, });
            this.regModeButton.setText("[→] Timed Mode: \nSmash as many objects as you \ncan within the time limit! \nHow high of a score can you get!");
            this.regModeSelected = true;
            this.speedModeSelected = false;
        }

        // Animation for hovering Speed Run Mode
        if(this.startModeOptions && !this.speedModeSelected && (Phaser.Input.Keyboard.JustDown(this.keyDOWN) || Phaser.Input.Keyboard.JustDown(this.keyS))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.regModeSelected) { 
                this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnimMoveInAnchor, ease: 'Linear', duration: 200, });
                this.regModeButton.setText("[↑] Timed Mode");
            }
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnimMoveOutAnchor, ease: 'Linear', duration: 200, });
            this.speedModeButton.setText("[→] Speed Run Mode: \nDestroy every object in the \nlevel as fast as you can! \nThe quicker the better!");
            this.speedModeSelected = true;
            this.regModeSelected = false;
        }

        // Starts the game if player selected to play one of the modes
        if((this.regModeSelected || this.speedModeSelected) && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            if(this.speedModeSelected) { speedrunMode = true; } 
            else { speedrunMode = false; }
            //this.resetFlags();

            game.settings = { gameTimer: 30000 }
            this.bg_music.stop();
            this.spinVacuum.stop();
            console.log(speedrunMode);
            if(this.speedModeSelected) { this.resetFlags(); this.scene.start('speedrunScene');} 
            else { this.resetFlags(); this.scene.start('playScene');}
        }
        
        // Animation for hovering Tutorial Button
        if(!this.tutorialSelected && !this.startModeOptions && (Phaser.Input.Keyboard.JustDown(this.keyDOWN) || Phaser.Input.Keyboard.JustDown(this.keyS))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.startSelected) {
                this.startButton.setText("[↑] Play");
                this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
                this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
                this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 200, });
            }
            this.tutorialButton.setText("[→] Tutorial");
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnim, ease: 'Linear', duration: 200, });
            this.startSelected = false;
            this.tutorialSelected = true;
        }
       
        // Starts the tutorial if player selects the tutorial button
        if(this.tutorialSelected && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            game.settings = { gameTimer: 600000 }
            speedrunMode = false;
            this.bg_music.stop();
            this.spinVacuum.stop();
            this.scene.start('tutorialScene');
        }

        if(Phaser.Input.Keyboard.JustDown(this.keyC)) {
            if(this.creditsContent.alpha == 0) { this.tweens.add({ targets: this.creditsContent, ease: 'Bounce', x: game.config.width * 0.27 +100, duration: 2000,  alpha: 1, }); 
                                                this.sound.play('gmGet', { volume: 1 });}
            else   { this.tweens.add({ targets: this.creditsContent, ease: 'Quintic', x: -200, duration: 2000, alpha: 0, }); }
        }

        // Resets all options if player hits left arrow - Goes back to the default menu
        if(Phaser.Input.Keyboard.JustDown(this.keyLEFT) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.sound.play('Select', { volume: 0.5 });
            this.resetFlags();
            this.startButton.setText("[↑] Play");
            this.tutorialButton.setText("[↓] Tutorial");
            this.regModeButton.setText("[↑] Timed Mode");
            this.speedModeButton.setText("[↓] Speed Run Mode");
            this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 200, });
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 200, });
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
        }

        // Scrolling the cat in and out of frame and managing audio
        this.scrollCat();
        this.updateMedals();
    }

    resetFlags() {
        this.regModeSelected = false;
        this.speedModeSelected = false;
        this.startModeOptions = false;
        this.startSelected = false;
        this.tutorialSelected = false;
    }

    scrollCat() {
        // reposition cat if necessary
        if (this.spinnningCat.x >= this.spinCatMaxX) {
            this.spinnningCat.x = this.spinCatMinX;    
        }

        // move cat
        this.spinnningCat.x += 4;

        // change volume based on distance to center
        let currVolume = .055 - (.055 * this.inverseLerp(Math.abs(this.spinnningCat.x - game.config.width*.5), 25, 1100));
        this.spinVacuum.setVolume(currVolume);
    }

    inverseLerp(point, a, b) {
        if (point >= b) {
            return 1.0;
        } else if (point <= a) {
            return 0.0;
        }
        
        point = Phaser.Math.Clamp(point, a, b);
        let d = b - a;
        let f = b - point;
        return (d - f) / d;
    }

    displayMedals(){
        // Display medals for Timed mode
        if(timedMedal == 'gold'){
            this.rMedal = this.add.image(this.startButton.x - 100, this.startButton.y, 'goldMedal');
            this.rMedal.setScale(0.1);
        } else if (timedMedal == 'silver'){
            this.rMedal = this.add.image(this.startButton.x - 100, this.startButton.y, 'silverMedal');
            this.rMedal.setScale(0.1);
        } else if (timedMedal == 'bronze'){
            this.rMedal = this.add.image(this.startButton.x - 100, this.startButton.y, 'bronzeMedal');
            this.rMedal.setScale(0.1);
        }
        // Display medals for speedRun mode
        if(speedRunMedal == 'gold'){
            this.sMedal = this.add.image(this.startButton.x - 60, this.startButton.y, 'goldMedal');
            this.sMedal.setScale(0.1);
        } else if (speedRunMedal == 'silver'){
            this.sMedal = this.add.image(this.startButton.x - 60, this.startButton.y, 'silverMedal');
            this.sMedal.setScale(0.1);
        } else if (speedRunMedal == 'bronze'){
            this.sMedal = this.add.image(this.startButton.x - 60, this.startButton.y, 'bronzeMedal');
            this.sMedal.setScale(0.1);
        }
        // Display medal for completeing tutorial
        if(tutorialMedal == 'gold'){
            this.tMedal = this.add.image(this.tutorialButton.x - 100, this.tutorialButton.y, 'goldMedal');
            this.tMedal.setScale(0.1);
        }
    }

    updateMedals(){
        // Update medals
        if(this.regModeSelected){
            if(timedMedal != 'none'){
                this.rMedal.x = this.regModeButton.x - 120;
                this.rMedal.y = this.regModeButton.y - 58;
            }
            // Display medals for speedRun mode
            if(speedRunMedal != 'none'){
                this.sMedal.x = this.speedModeButton.x - 120;
                this.sMedal.y = this.speedModeButton.y - 4;
            }
        } else if(this.speedModeSelected){
            if(timedMedal != 'none'){
                this.rMedal.x = this.regModeButton.x - 120;
                this.rMedal.y = this.regModeButton.y - 8;
            }
            // Display medals for speedRun mode
            if(speedRunMedal != 'none'){
                this.sMedal.x = this.speedModeButton.x - 130;
                this.sMedal.y = this.speedModeButton.y - 56;
            }
        }else if(this.startModeOptions){
            if(timedMedal != 'none'){
                this.rMedal.x = this.regModeButton.x - 120;
                this.rMedal.y = this.regModeButton.y - 8;
            }
            // Display medals for speedRun mode
            if(speedRunMedal != 'none'){
                this.sMedal.x = this.speedModeButton.x - 120;
                this.sMedal.y = this.speedModeButton.y - 4;
            }
        } else {
            if(timedMedal != 'none'){
                this.rMedal.x = this.startButton.x - 100;
                this.rMedal.y = this.startButton.y;
            }
            // Display medals for speedRun mode
            if(speedRunMedal != 'none'){
                this.sMedal.x = this.startButton.x - 60;
                this.sMedal.y = this.startButton.y;
            }
        }
        //update tutorial medals
        if (tutorialMedal != 'none'){
            this.tMedal.x = this.tutorialButton.x - 80;
            this.tMedal.y = this.tutorialButton.y;
        }
    }
}