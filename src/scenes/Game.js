import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
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
		this.starSpawner = undefined
		this.stars = undefined
		this.bombSpawner = undefined
		this.gameOver = false
		this.platforms = undefined
	}

	preload()
    {

        this.load.image('sky', 'assets/backgrounds/blue-sky.png');
        this.load.image('redbg', 'assets/backgrounds/red-bg.png');
        this.load.image('ground', 'assets/platforms/platform.png');
        this.load.image('gardenPlatform', 'assets/platforms/green1.png');
        this.load.image('cavePlatform', 'assets/platforms/cave-platform.png');
        this.load.image('star', 'assets/objects/star.png');
        this.load.image('pixel', 'assets/objects/transparent-pixel.png');
        this.load.image('bomb', 'assets/characters/black-monster.png');
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
    	this.add.image(400, 300, 'sky')
    	this.scoreLabel = this.createScoreLabel(16, 16, 0)

    	// platforms
    	this.platformManager = new PlatformManager(this)
    	this.platformManager.create(400, 550, 'gardenPlatform', 'meadows')
    	this.platformManager.create(880, 400, 'gardenPlatform', 'meadows')
    	this.platformManager.create(-80, 250, 'gardenPlatform', 'meadows')
    	this.platformManager.create(1000, 220, 'gardenPlatform', 'meadows')
    	this.platforms = this.platformManager.group
    	
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

    }

    update()
    {

		if (this.gameOver) { return }

		// listen for player input
		this.playerSpawner.group.children.iterate((player) => this.playerSpawner.listenToControls(player))

		// ensure platforms don't extend beyond their limits
		this.platforms.children.iterate((platform) => this.platformManager.stopAtLimits(platform))

    }

	hitBomb(player, bomb)
	{

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

	collectStar(player, star)
	{

		this.ding.play();
		star.disableBody(true, true)
		this.scoreLabel.add(10)

		// add harry mcscary
		if (this.starSpawner.countActive() === 0 || this.starSpawner.countActive() === 6) { this.bombSpawner.spawn(player.x) }

		// if all stars gone
		if (this.starSpawner.countActive() === 0) { 

			// tada noise
			this.tada.play()

			// hide current world
			this.platformManager.toggleWorld('meadow', 'hide');

			// reset stars after giving time for world to reload
			this.time.delayedCall(3000, () => { this.platformManager.toggleWorld('meadow', 'show'); }, [], this);

			// reset stars after giving time for world to reload
			this.time.delayedCall(7000, () => { this.starSpawner.reset(); }, [], this);
			
		}

	}	

}
