import Phaser from 'phaser'
import ScoreLabel from '../ui/ScoreLabel'
import BombSpawner from './BombSpawner'
import StarSpawner from './StarSpawner'

export default class Game extends Phaser.Scene
{
	constructor()
	{
		super('game')
		this.player = undefined
		this.scoreLabel = undefined
		this.starSpawner = undefined
		this.stars = undefined
		this.bombSpawner = undefined
		this.gameOver = false
	}

	preload()
    {

        this.load.image('sky', 'assets/backgrounds/blue-sky.png');
        this.load.image('redbg', 'assets/backgrounds/red-bg.png');
        this.load.image('ground', 'assets/platforms/platform.png');
        this.load.image('greenPlatform1', 'assets/platforms/green1.png');
        this.load.image('cavePlatform', 'assets/platforms/cave-platform.png');
        this.load.image('star', 'assets/objects/star.png');
        this.load.image('bomb', 'assets/characters/black-monster.png');
        this.load.audio("ding", 'assets/sounds/ding.mp3');
        this.load.audio("harry", 'assets/sounds/harry-capture.mp3');
        this.load.audio("tada", 'assets/sounds/tada.mp3');
        this.load.spritesheet('dude', 
            'assets/characters/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )

    }

    create()
    {

    	// environment, playtforms, players, and score
    	this.add.image(400, 300, 'sky')
    	const platforms = this.createPlatforms()
    	this.player = this.createPlayer()
    	this.scoreLabel = this.createScoreLabel(16, 16, 0)

    	// stars
    	this.starSpawner = new StarSpawner(this, 'star')
    	const starsGroup = this.starSpawner.group
    	this.starSpawner.spawn();

    	// bombs
    	this.bombSpawner = new BombSpawner(this, 'bomb')
    	const bombsGroup = this.bombSpawner.group

    	// colliders
    	this.physics.add.collider(this.player, platforms)
    	this.physics.add.overlap(this.player, starsGroup, this.collectStar, null, this)
    	this.physics.add.collider(starsGroup, platforms)
    	this.physics.add.collider(bombsGroup, platforms)
    	this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)

    	// audio
    	this.ding = this.sound.add("ding", { loop: false });
    	this.harry = this.sound.add("harry", { loop: false });
    	this.tada = this.sound.add("tada", { loop: false });

    }

    update()
    {

		if (this.gameOver)
		{
			return
		}

        if (this.input.keyboard.addKey('A').isDown) {
			this.player.setVelocityX(-160)
			this.player.anims.play('left', true)
        } else if (this.input.keyboard.addKey('D').isDown) {
			this.player.setVelocityX(160)
			this.player.anims.play('right', true)
        } else {
			this.player.setVelocityX(0)
			this.player.anims.play('turn')
        }

        if (this.input.keyboard.addKey('W').isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }

    }

	hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}

	createScoreLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#000' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

	createPlatforms()
	{
		const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, 'ground').setScale(2).refreshBody()
	
		platforms.create(600, 400, 'ground')
		platforms.create(50, 250, 'ground')
		platforms.create(750, 220, 'ground')

		return platforms

	}

	collectStar(player, star)
	{

		this.ding.play();
		star.disableBody(true, true)
		this.scoreLabel.add(10)

		// add harry mcscary
		if (this.starSpawner.countActive() === 0 || this.starSpawner.countActive() === 6) { this.bombSpawner.spawn(player.x) }

		// add stars back
		if (this.starSpawner.countActive() === 0) { this.starSpawner.reset() }

	}

	createPlayer()
	{
		const player = this.physics.add.sprite(100, 450, 'dude')
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

		return player

	}	

}
