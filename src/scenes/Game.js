import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import LevelManager from './LevelManager'
import BombSpawner from './BombSpawner'
import StarSpawner from './StarSpawner'
import PlayerSpawner from './PlayerSpawner'
import PlatformManager from './PlatformManager'

export default class Game extends Phaser.Scene
{
	constructor()
	{
		super('game')
		this.scoreLabel = undefined
		this.levelManager = undefined
		this.starSpawner = undefined
		this.stars = undefined
		this.bombSpawner = undefined
		this.gameOver = false
		this.platforms = undefined
	}

	preload()
    {

        this.load.image('meadowsBg', 'assets/backgrounds/meadows.png');
        this.load.image('caveBg', 'assets/backgrounds/cave.png');
        this.load.image('iceBg', 'assets/backgrounds/ice.png');
        this.load.image('lavaBg', 'assets/backgrounds/lava.png');
        this.load.image('meadowsPlatform', 'assets/platforms/meadows.png');
        this.load.image('cavePlatform', 'assets/platforms/cave.png');
        this.load.image('icePlatform', 'assets/platforms/ice.png');
        this.load.image('iceBasePlatform', 'assets/platforms/ice-base.png');
        this.load.image('lavaPlatform', 'assets/platforms/lava.png');
        this.load.image('star', 'assets/objects/star.png');
        this.load.image('pixel', 'assets/objects/transparent-pixel.png');
        this.load.image('bomb', 'assets/characters/black-monster.png');
        this.load.audio("meadowsBgMusic", 'assets/sounds/meadows-bg.mp3');
        this.load.audio("caveBgMusic", 'assets/sounds/cave-bg.mp3');
        this.load.audio("iceBgMusic", 'assets/sounds/ice-bg.mp3');
        this.load.audio("lavaBgMusic", 'assets/sounds/lava-bg.mp3');
        this.load.audio("ding", 'assets/sounds/ding.mp3');
        this.load.audio("harry", 'assets/sounds/harry-capture.mp3');
        this.load.audio("tada", 'assets/sounds/tada.mp3');
        this.load.audio("oof", 'assets/sounds/oof.mp3');
        this.load.spritesheet('dude', 
            'assets/characters/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )

    }

    create()
    {

    	// environment, playtforms, and score
    	this.bg = this.add.image(400, 300, 'meadowsBg')

    	this.scoreLabel = this.createScoreLabel(16, 16, 0)

    	this.levelManager = this.createLevelManager(630, 16, 1)

    	// platforms
    	this.platformManager = new PlatformManager(this)
    	this.platformManager.createWorld('meadows', true);
    	this.platformManager.createWorld('cave', false);
    	this.platformManager.createWorld('ice', false);
    	this.platformManager.createWorld('lava', false);
    	this.platforms = this.platformManager.group // able to reference from this.platforms
    	
    	// player
    	this.playerSpawner = new PlayerSpawner(this)
    	const playersGroup = this.playerSpawner.group
    	this.playerSpawner.spawn(100, 'wasd');
    	//this.playerSpawner.spawn(200, 'arrows');
    	//this.playerSpawner.spawn(300, 'uhjk');
    	this.playerSpawner.setAnimations();

    	// stars
    	this.starSpawner = new StarSpawner(this, 'star')
    	const starsGroup = this.starSpawner.group
    	this.starSpawner.spawn();

    	// bombs
    	this.bombSpawner = new BombSpawner(this, 'bomb')
    	const bombsGroup = this.bombSpawner.group

    	// colliders
    	this.physics.add.collider(playersGroup, this.platforms)
    	this.physics.add.overlap(playersGroup, starsGroup, this.collectStar, null, this)
    	this.physics.add.collider(starsGroup, this.platforms)
    	this.physics.add.collider(bombsGroup, this.platforms)
    	this.physics.add.collider(playersGroup, bombsGroup, this.hitBomb, null, this)

    	// audio
    	this.ding = this.sound.add("ding", { loop: false });
    	this.harry = this.sound.add("harry", { loop: false });
    	this.tada = this.sound.add("tada", { loop: false });
    	this.oof = this.sound.add("oof", { loop: false });
    	this.bgMusic = this.sound.add("meadowsBgMusic", { loop: true });
    	this.updateMusic('meadows');

    	// fullscreen
    	this.input.keyboard.addKey('F').on('down', (event) => this.scale.startFullscreen());

    }

    update()
    {

		if (this.gameOver) { return }

		// listen for player input
		this.playerSpawner.group.children.iterate((player) => this.playerSpawner.listenToControls(player))

		// ensure platforms don't extend beyond their limits
		this.platforms.children.iterate((platform) => this.platformManager.stopAtLimits(platform))

    }

    updateMusic(world)
    {

    	let key;

    	switch(world) {
    		case "meadows":
    			key = 'meadowsBgMusic';
    			break;
    		case "cave":
    			key = 'caveBgMusic';
    			break;
    		case "ice":
    			key = 'iceBgMusic';
    			break;
    		case "lava":
    			key = 'lavaBgMusic';
    			break;
    	}

    	this.bgMusic.stop()

    	this.bgMusic = this.sound.add(key, { loop: true });

    	this.bgMusic.play()
    }

	hitBomb(player, bomb)
	{

		this.bgMusic.stop()

		this.oof.play();

		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.time.delayedCall(2000, () => { this.scene.restart(); }, [], this); // restart game after x milliseconds

	}

	createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

	createLevelManager(x, y, level)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new LevelManager(this, x, y, level, style)

		this.add.existing(label)

		return label
	}

	win()
	{
		this.bgMusic.stop()
		this.tada.play();
		this.scene.start('win');
	}

	collectStar(player, star)
	{

		this.ding.play();
		star.disableBody(true, true)
		this.scoreLabel.add(10)

		// add harry mcscary
		let randomNumber = Math.floor(Math.random() * 100);
		if (randomNumber <= 2) { this.bombSpawner.spawn(player.x) }

		// if all stars gone
		if (this.starSpawner.countActive() === 0) { 

			// stop bg music
			this.bgMusic.stop();

			// tada noise
			this.tada.play()

			// hide current world
			let completedWorld = this.levelManager.getWorldByLevel(this.levelManager.level);
			this.platformManager.toggleWorld(completedWorld, 'hide');

			// check if won game
			if (this.levelManager.level == 4) { this.win(); }

			// next level
			this.levelManager.add()

			// reset stars after giving time for world to reload
			this.time.delayedCall(3000, () => { 
				
				let nextWorld = this.levelManager.getWorldByLevel(this.levelManager.level);

				// load new world
				this.platformManager.toggleWorld(nextWorld, 'show')
				
				// load new music
				this.updateMusic(nextWorld)

			}, [], this);

			// reset stars after giving time for world to reload
			this.time.delayedCall(7000, () => { this.starSpawner.reset(); }, [], this);
			
		}

	}	

}
