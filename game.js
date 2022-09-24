let score = 0
let stars = ''
let bombs = ''
let gameover = false
let player
let clearCourse = ''
let dieSound
let collectSound


class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene')
    }



    preload () {
        this.load.image('sky', '/assets/sky.png');
        this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
        this.load.image('bomb', './assets/bomb.png');
        this.load.image('star', './assets/star.png')
        this.load.audio('clear', './assets/levelClear.mp3')
        this.load.audio('die', './assets/dying.mp3')
        this.load.audio('collect', './assets/coinSound.mp3')
      }
      
    create () {
        this.add.image(400, 300, 'sky');

        //sounds
        clearCourse = this.sound.add('clear')
        dieSound = this.sound.add('die')
        collectSound = this.sound.add('collect')
     

        //player
        player = this.physics.add.sprite(400, 300, 'bird').setScale(0.09);
        player.setCollideWorldBounds(true);
        
        this.anims.create({
          key: 'flying',
          frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
          frameRate: 10,
          repeat: -1,
        })

        player.anims.play('flying')

      

        this.text = this.add.text(20, 20, 'score: 0', {fontSize: '22px', color: '#fff'})

        //enemies
        bombs = this.physics.add.group();
        createBomb()

        stars = this.physics.add.group();
     
        for (let i = 0; i < 5; i++) {
            stars.create(Phaser.Math.Between(10, 790), Phaser.Math.Between(10, 590), 'star')
        }

        //Colliders and overlaps
        this.physics.add.overlap(player, stars, collectStars, null, this)
        this.physics.add.collider(player, bombs, hitBomb, null, this)
  
     


        //cursors
        this.cursors = this.input.keyboard.createCursorKeys();
      }
    
    update() {

        if(gameover === true) {
            return
        }
   
        if(this.cursors.left.isDown) {
            player.setVelocityX(-500)
            player.flipX = true;
        } else if (this.cursors.right.isDown) {
            player.setVelocityX(500)
            player.flipX = false;
        } else {
            player.setVelocityX(0);
        }

        if(this.cursors.up.isDown) {
          player.setVelocityY(-500)
        } else if (this.cursors.down.isDown) {
          player.setVelocityY(500);
        } else {
          player.setVelocityY(0);
        }
    }

    
      
}

function collectStars(player, stars) {
    collectSound.play()
    stars.disableBody(true, true)
    score += 10
    this.text.setText('score: ' + score)

    if(score === 50) {
      generateStars()
      createBomb()
    } else if (score === 100) {
      generateStars()
      createBomb()
    } else if (score === 150) {
      generateStars()
      createBomb()
    } else if (score === 200) {
      generateStars()
      createBomb()
    } else if (score == 250) {
      generateStars()
      createBomb()
    }

    if (score === 300) {
      clearCourse.play()
      this.add.text(300, 200, 'Course Clear!', {fontSize: '27px'})
      this.physics.pause()
      this.anims.pauseAll()
      gameover = true
    }
  
  
}

function generateStars() {
 
  for (let i = 0; i < 5; i++) {
    stars.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 570), 'star')
}
}

function hitBomb() {
    dieSound.play()
    this.physics.pause()
    this.anims.pauseAll()
    gameover = true
    this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})
}

function createBomb() {
    let bomb = bombs.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 770), 'bomb');
    bomb.body.setVelocity(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-350, 350));
    bomb.setCollideWorldBounds(true)
    bomb.setBounce(1);
}


  
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x:0, y:0 },
      }
    },
    scene: [PlayScene],
  };
  
  const game = new Phaser.Game(config);

  