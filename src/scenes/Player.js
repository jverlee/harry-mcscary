import Phaser from 'phaser'

export default class Player
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene)
	{
		this.scene = scene
	}

	create()
	{

		const player = this.scene.physics.add.sprite(100, 450, 'dude')
		player.setBounce(0.2)
		player.setCollideWorldBounds(true)

		this.scene.anims.create({
			key: 'left',
			frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.scene.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		})
		
		this.scene.anims.create({
			key: 'right',
			frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

		return player

	}
}