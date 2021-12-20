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

	spawn(x, controls)
	{

        let player = this.group.create(x, 425, 'dude')
        		.setBounce(0.2)
        		.setCollideWorldBounds(true)
				.setVelocityY(0)

		player.controls = controls;

		return player;

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

	listenToControls(player)
	{

		let controls = this.getControls(player);

        if (controls.left.isDown) {
			player.setVelocityX(-160)
			player.anims.play('left', true)
        } else if (controls.right.isDown) {
			player.setVelocityX(160)
			player.anims.play('right', true)
        } else {
			player.setVelocityX(0)
			player.anims.play('turn')
        }

        if (controls.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330)
        }

	}

	getControls(player) {

		// WASD is default
		let up = this.scene.input.keyboard.addKey('W');
		let left = this.scene.input.keyboard.addKey('A');
		let down = this.scene.input.keyboard.addKey('S');
		let right = this.scene.input.keyboard.addKey('D');

		switch (player.controls) {

			case "uhjk":
				up = this.scene.input.keyboard.addKey('U');
				left = this.scene.input.keyboard.addKey('H');
				down = this.scene.input.keyboard.addKey('J');
				right = this.scene.input.keyboard.addKey('K');			
				break;

			case "arrows":
				let cursors = this.scene.input.keyboard.createCursorKeys();
				up = cursors.up;
				left = cursors.left;
				down = cursors.down;
				right = cursors.right;
				break;

		}

		return { up: up, left: left, down: down, right: right }

	}

}