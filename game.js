let score = 150
let stars = ''
let grapes = ''
let bombs = ''
let gameover = false
let player
let clearCourse = ''
let dieSound
let collectSound
let clouds = ''

class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene')
  }

  preload() {
      this.load.image('sky', './assets/sky.png')
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.text(310, 200, 'Bird Game', {fontSize: '35px', color: '#fff'})
    this.add.text(235, 260, 'Click to start the game', {fontSize: '25px', color: '#fff'})

    this.input.on('pointerdown', () => {
				this.scene.stop();
        this.scene.start("LevelTwo");
			})
  }

  
}


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
    } 
  
 
    if (score === 150) {
      clearCourse.play()
      this.add.text(300, 200, 'Course Clear!', {fontSize: '27px'})
      this.physics.pause()
      player.anims.stop('flying')
      gameover = true

      setTimeout(() => {
          this.add.text(285, 250, 'Click to continue', {fontSize: '24px'})
          this.input.on('pointerdown', () => {
          this.scene.stop();
          gameover = false
          player.anims.play('flying')
          this.scene.start("LevelTwo");
          
			})
      }, 3000)
    
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
    player.anims.stop('flying')
    gameover = true
    this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})

    setTimeout(() => {
        this.scene.stop()
        this.scene.start('StartScene')
        score = 0
        this.physics.resume()
        gameover = false
        player.anims.play('flying')
    }, 3000)
}

function createBomb() {
    let bomb = bombs.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 770), 'bomb');
    bomb.body.setVelocity(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-350, 350));
    bomb.setCollideWorldBounds(true)
    bomb.setBounce(1);
}

class LevelTwo extends Phaser.Scene {
  constructor() {
      super('LevelTwo')
  }

  preload() {
      this.load.image('sky', './assets/sky.png')
      this.load.atlas('bird', './assets/birdsheet.png', './assets/birdsheet.json')
      this.load.image('grape', './assets/grapes.png')
      this.load.audio('clear', './assets/levelClear.mp3')
      this.load.audio('die', './assets/dying.mp3')
      this.load.audio('collect', './assets/coinSound.mp3')
      this.load.image('cloud_1', './assets/Cloud_1.png')
      this.load.image('cloud_2', './assets/Cloud_2.png')
      this.load.image('cloud_3', './assets/Cloud_3.png')
  }



  create() {
      this.add.image(400, 300, 'sky')
      this.text = this.add.text(20, 20, 'score: ' + score, {fontSize: '22px', color: '#fff'})

      //sounds
      collectSound = this.sound.add('collect')
      dieSound = this.sound.add('die')
      clearCourse = this.sound.add('clear')
     

      //player
      this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNames('bird', {prefix: 'flying', end: 2, zeroPad: 3}),
        frameRate: 10,
        repeat: -1,
      })

      player = this.physics.add.sprite(400, 300, 'bird').setScale(0.09);
      player.setCollideWorldBounds(true);

      player.anims.play('fly')

      //Grapes
      grapes = this.physics.add.group()
      generateGrapes()

      //Clouds
      clouds = this.physics.add.group()
      this.cloud = clouds.create(0, Phaser.Math.Between(30, 580), 'cloud_1').setScale(0.4);
      this.cloud2 = clouds.create(-10, Phaser.Math.Between(30, 580), 'cloud_2').setScale(0.4);
      this.cloud3 = clouds.create(config.width + 78, Phaser.Math.Between(30, 580), 'cloud_3').setScale(0.4);
      // generateClouds()
     
      
      //colliders
      this.physics.add.overlap(grapes, player, collectGrape, null, this)
      this.physics.add.collider(clouds, player, hitCloud, null, this)
     
      
      //cursors
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    moveCloud(cloud, speed) {
    cloud.x += speed; 
    if(cloud.x > config.width + 55) {
        this.resetCloudPos(cloud)
    }  
  }

    moveCloudReverse(cloud, speed) {
      cloud.x -= speed;
      if(cloud.x < config.width - 860) {
        this.resetReverseCloudPos(cloud)
      }
    }

    resetCloudPos(cloud) {
    cloud.x = 0;
    let randomY = Phaser.Math.Between(0, config.height)
    cloud.y = randomY
  }

    resetReverseCloudPos(cloud) {
      cloud.x = config.width + 77
      let randomY = Phaser.Math.Between(0, config.height -20)
      cloud.y = randomY
    }

  update() {

    this.moveCloud(this.cloud, 1)
    this.moveCloud(this.cloud2, 2)
    this.moveCloudReverse(this.cloud3, 3)


    if(gameover) {
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
function collectGrape(player, grapes) {
  score += 10
  this.text.setText('score: ' + score)
  grapes.disableBody(true, true)
  collectSound.play()

  if(score === 200) {
    generateGrapes()

  } else if (score === 250) {
    generateGrapes()
    //createCloud3()
  } 

  if (score === 300) {
    clearCourse.play()
    this.add.text(300, 200, 'Course Clear!', {fontSize: '27px'})
    player.anims.stop('fly')
    this.physics.pause()
    gameover = true

  }

}
function generateGrapes() {
  for (let i = 0; i < 5; i++) {
    grapes.create(Phaser.Math.Between(30, 770), Phaser.Math.Between(30, 570), 'grape').setScale(1.9)
}
}

function hitCloud() {
  dieSound.play()
  this.physics.pause()
  this.cloud.destroy()
  player.anims.stop('fly')
  gameover = true
  this.add.text(310, 200, 'Game Over!', {fontSize: '27px'})

  setTimeout(() => {
    this.scene.stop()
    this.scene.start('StartScene')
    score = 0
    this.physics.resume()
    gameover = false
    player.anims.play('fly')
}, 3000)
}

function generateClouds() {
  let cloud = clouds.create(0, Phaser.Math.Between(30, 770), 'cloud_1').setScale(0.4);
  cloud.body.setVelocity(Phaser.Math.Between(-350, 350), Phaser.Math.Between(-350, 350));
  cloud.setCollideWorldBounds(true)
  cloud.setBounce(1);     
  }

  function createCloud2() {
    let cloud2 = clouds.create(0, Phaser.Math.Between(30, 770), 'cloud_2').setScale(0.45);
    this.moveCloud(cloud2, 2)
  }
  function createCloud3() {
    cloud = clouds.create(0, Phaser.Math.Between(30, 770), 'cloud_3').setScale(0.28);
   
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
    scene: [StartScene, PlayScene, LevelTwo],
  };
  
  const game = new Phaser.Game(config);

  