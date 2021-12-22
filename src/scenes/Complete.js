import Phaser from 'phaser'

export default class Complete extends Phaser.Scene
{
	constructor()
	{
		super('complete')
        this.score = 0 // stars
        this.points = 0 // total
        this.playerCount = 3
        this.timeLeft = 0
        this.leaderboardRows = []
	}

    init(data)
    {
        this.playerCount = (data.playerCount) ? data.playerCount : this.playerCount;
        this.timeLeft = (data.timeLeft) ? data.timeLeft : this.timeLeft;
        this.score = (data.score) ? data.score : this.score;
        this.points = this.score + this.timeLeft
    }

	preload()
    {

        this.load.image('background', 'assets/backgrounds/menu.png');
        this.load.image('logo', 'assets/objects/win.png');
        this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png')
        this.load.image('restart', 'assets/buttons/restart.png')
        this.load.image('enterName', 'assets/buttons/enter-name.png')
        this.load.image('playAgain', 'assets/buttons/play-again.png')
        this.load.image('save', 'assets/buttons/save.png')
        this.load.image("trophy", 'assets/objects/trophy.png');
        this.load.audio("win", 'assets/sounds/win.mp3');
    }

    create()
    {

        this.game.sound.stopAll(); // stop any sound that may still be going

        this.bgMusic = this.sound.add("win", { loop: true });
        this.bgMusic.play();

        this.add.image(400, 300, 'background')

        this.showLeaderboard('score');

    }

    displayScoreRanked() {

        this.overlayRect = this.add.graphics();
        this.overlayRect.fillStyle(0x000000, 1);
        this.overlayRect.fillRoundedRect(162, 122, 490, 430, 16);
        this.overlayRect.setAlpha(0.9)


        this.title = this.add.text(280, 150, "You made the top 10!").setFontSize(25).setColor('#ffffff').setFontFamily("Arial");

        this.anyKeyText = this.add.text(320, 183, "Click any key to continue.").setFontSize(13).setColor('#ffffff').setFontFamily("Arial");

        this.scoreLine = this.add.line(0,0,410,220,850,220,0xffffff);

        this.scoreAmount = this.add.text(230, 410, this.points + " Points").setFontSize(80).setColor('#ffffff').setFontFamily("Arial");

        this.scoreDescription = this.add.text(285, 500, "(" + this.score + " Stars + " + this.timeLeft + " Time Bonus)").setFontSize(18).setColor('#ffffff').setFontFamily("Arial");

        this.trohpy = this.add.image(400, 320, 'trophy');

        this.anyKey = this.input.keyboard.on('keydown', (event) => this.enterName());

        this.anyClick = this.input.on('pointerdown', () => this.enterName());

    }

    enterName() {

        this.title.destroy();
        this.scoreLine.destroy();
        this.scoreAmount.destroy();
        this.scoreDescription.destroy();
        this.trohpy.destroy();
        this.anyKeyText.destroy();

        this.anyKey.off('keydown')
        this.anyClick.off('pointerdown')

        this.title = this.add.text(280, 150, "Enter Name").setFontSize(45).setColor('#ffffff').setFontFamily("Arial");

        this.description = this.add.text(234, 203, "Other people will be able to see this name.").setFontSize(17).setColor('#ffffff').setFontFamily("Arial");



        var inputRect = this.add.graphics();
        inputRect.fillStyle(0xffffff, 1);
        inputRect.fillRoundedRect(202, 242, 410, 80, 16);
        inputRect.setAlpha(1)


        let save = this.add.image(400, 430, 'save').setInteractive({ useHandCursor: true  }).setAlpha(0.6);

        let textEntry = this.add.text(220, 260, '', { font: '49px Arial', fill: '#000000' });

        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === 8 && textEntry.text.length > 0)
            {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
            {
                textEntry.text += event.key;
            }

            if (textEntry.text.length > 0) { save.setAlpha(1) } else { save.setAlpha(0.6) }

        });

        
        let context = this;
        save.on('pointerdown', (pointer) => {

              if (!textEntry.text.length) { return false } // require name

                let payload = {
                    name: textEntry.text,
                    score: this.points,
                    game: "harrymcscary"
                }

              fetch('https://jdv-leaderboard.herokuapp.com/rank', {
                method: 'post',
                body: JSON.stringify(payload),
                headers: {"Content-type": "application/json; charset=UTF-8"}
              }).then(function(response) {
                return response.json();
              }).then(function(data) {
                
                textEntry.destroy();
                save.destroy();
                inputRect.destroy();
                context.title.destroy();
                context.description.destroy();
                context.overlayRect.destroy();

                context.loadingOverlayRect = context.add.graphics();
                context.loadingOverlayRect.fillStyle(0xffffff, 1);
                context.loadingOverlayRect.fillRoundedRect(0, 0, 800, 600, 0);
                context.loadingOverlayRect.setAlpha(0.6)

                context.showLeaderboard('retry')

              });

        });

    }

    displayScoreNotRanked() {

        let graphics = this.add.graphics();

        graphics.fillStyle(0x000000, 1);

        //  32px radius on the corners
        graphics.fillRoundedRect(162, 122, 490, 430, 16);

        graphics.setAlpha(0.97)


        this.add.text(200, 155, "Good Job! You didn't make the top 10 but keep at it!").setFontSize(18).setColor('#ffffff').setFontFamily("Arial");

        this.add.line(0,0,410,200,850,200,0xffffff);

        this.add.text(230, 240, this.points + " Points").setFontSize(80).setColor('#ffffff').setFontFamily("Arial");

        this.add.text(285, 330, "(" + this.score + " Stars + " + this.timeLeft + " Time Bonus)").setFontSize(18).setColor('#ffffff').setFontFamily("Arial");

        let restart = this.add.image(400, 430, 'restart').setInteractive({ useHandCursor: true  });

        restart.on('pointerdown', (pointer) => {
            this.bgMusic.stop();
            this.scene.start('game', { playerCount: this.playerCount })
        });

    }

    scoreToBeat(ranks) {

        let scoreToBeat = 9999999999;

        ranks.forEach((rank) => {
            scoreToBeat = (rank.score < scoreToBeat) ? rank.score : scoreToBeat
        })

        return scoreToBeat;

    }

    highScoreAdded() {

        let graphics = this.add.graphics();

        graphics.fillStyle(0x000000, 1);

        //  32px radius on the corners
        graphics.fillRoundedRect(162, 122, 490, 430, 16);

        graphics.setAlpha(0.97)


        this.add.text(235, 175, "You're on the board!").setFontSize(38).setColor('#ffffff').setFontFamily("Arial");

        this.add.line(0,0,410,250,850,250,0xffffff);

        this.add.text(200, 300, "Why not try again? You can probably do even better!").setFontSize(18).setColor('#ffffff').setFontFamily("Arial");

        let playAgain = this.add.image(400, 410, 'playAgain').setInteractive({ useHandCursor: true  });

        playAgain.on('pointerdown', (pointer) => {
            this.bgMusic.stop();
            this.scene.start('game', { playerCount: this.playerCount })
        });

    }

    showLeaderboard(action) {

        let context = this
        let verticalSeparation = 0;
        let verticalSeparationIncrement = 55;
        let initialY = 30;
        let scoreToBeat = 999999999999999;

        fetch('https://jdv-leaderboard.herokuapp.com/rank')
          .then(response => response.json())
          .then(data => {

            if (context.loadingOverlayRect) { context.loadingOverlayRect.destroy(); }

            context.leaderboardRows.forEach((row) => row.destroy())

            data.forEach((rank) => {
                context.leaderboardRows.push(context.add.text(85, initialY + verticalSeparation, rank.name).setFontSize(30).setColor('#000000').setFontFamily("Arial"));
                context.leaderboardRows.push(context.add.text(385, initialY + verticalSeparation, this.dateFormat(rank.createdAt)).setFontSize(30).setColor('#000000').setFontFamily("Arial"));
                context.leaderboardRows.push(context.add.text(685, initialY + verticalSeparation, rank.score).setFontSize(30).setColor('#000000').setFontFamily("Arial"));
                verticalSeparation += verticalSeparationIncrement;

                scoreToBeat = this.scoreToBeat(data) // get the score needed to beat in order to be on the high scores list

            })

            let isHighScore = (this.points > scoreToBeat) ? true : false

            if (action == 'retry') {
                context.highScoreAdded();
            } else if (action == 'score' && isHighScore) {
                context.displayScoreRanked();
            } else if (action == 'score' && !isHighScore) {
                context.displayScoreNotRanked();
            }

          }).catch(function() {
            context.displayScoreNotRanked(); // if leaderboard can't be loaded, allow game to still work and keep playing
          });;

    }

    dateFormat = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString('default', { month: 'short' }) + " " + date.getDate() + ", " + date.getFullYear();
    }

}
