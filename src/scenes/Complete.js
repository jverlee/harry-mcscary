import Phaser from 'phaser'

export default class Complete extends Phaser.Scene
{
	constructor()
	{
		super('complete')
	}

	preload()
    {

        this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png')
        this.load.image('logo', 'assets/objects/win.png');
        this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png')
        this.load.audio("win", 'assets/sounds/win.mp3');
    }

    create()
    {

        this.win = this.sound.add("win", { loop: true }).play();

        this.add.image(400, 300, 'sky')

        const particles = this.add.particles('red')

        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        })

        const logo = this.physics.add.image(400, 100, 'logo')

        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)

        emitter.startFollow(logo)
    }
}
