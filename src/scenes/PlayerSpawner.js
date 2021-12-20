import Phaser from 'phaser'

export default class Player
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene)
	{
		this.scene = scene

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(x)
	{

        return this.group.create(x, 425, 'dude')
        		.setBounce(0.2)
        		.setCollideWorldBounds(true)
				.setVelocityY(0)

	}

	setAnimations()
	{

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

	}

	setActions(player)
	{


	}

}