import Phaser from 'phaser'

export default class TimerManager
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene)
	{
		this.scene = scene
		this.timeLeft = 120; // starting time
		this.timeLeftDisplay = undefined
		this.timer = undefined

		this._group = this.scene.physics.add.group()
	}

	add()
	{
		this.timeLeftDisplay = this.scene.add.text(730, 15, this.timeLeft).setFontSize(30).setColor('#000000').setFontFamily("Arial");
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
		if (this.timeLeft < 25) { this.timeLeftDisplay.setColor('#ff0000') }
		if (this.timeLeft <= 0) { 
			this.scene.gameDone();
		}
	}

}