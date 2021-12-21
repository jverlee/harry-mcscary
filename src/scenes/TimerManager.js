import Phaser from 'phaser'

export default class TimerManager
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene)
	{
		this.scene = scene
		this.timeLeft = 100; // starting time
		this.timeLeftDisplay = undefined
		this.timer = undefined

		this._group = this.scene.physics.add.group()
	}

	add()
	{
		this.timeLeftDisplay = this.scene.add.text(0, 0, this.timeLeft, { font: '"Arial"' });
		this.startTimer()
	}

	startTimer()
	{

		this.timer = this.scene.time.addEvent({
		    delay: 1000,
		    callback: () => this.tick(),
		    callbackScope: this,
		    loop: true
		});

	}

	stopTimer()
	{
		this.timer.remove();
	}

	tick() {
		this.timeLeft--;
		this.timeLeftDisplay.setText(this.timeLeft);
		if (this.timeLeft < 10) { this.timeLeftDisplay.setColor('#ff0000') }
		this.stopTimer();
	}

}