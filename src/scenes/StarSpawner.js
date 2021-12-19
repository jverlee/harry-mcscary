import Phaser from 'phaser'

export default class StarSpawner
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, starKey = 'star')
	{
		this.scene = scene
		this.key = starKey

		this._group = this.scene.physics.add.group()

		console.log(this._group);

	}

	get group()
	{

		return this._group
	}

	spawn()
	{

		for (var x = 12; x < 800; x += 70) {
			let bounceRate = Phaser.Math.FloatBetween(0.4, 0.8);
			let stars = this.group.create(x, 16, 'star').setBounceY(bounceRate)
		}

		return this.group;

	}

	reset() {

		this.scene.tada.play()

		this.group.children.iterate((child) => {
			child.enableBody(true, child.x, 0, true, true)
		})

	}

	countActive() {
		return this.group.countActive(true);
	}
}