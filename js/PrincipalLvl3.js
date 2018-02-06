//Juego Desarrollado por Verónica Carolina Morales Pino
//06/02/2018
//Librerias utilizadas bootstrap.js, bootstrap.min.css,
// bootstrap.min.js, jquery-2.1.1.min.js, phaser.js, phaser.min.js
//Carga desde json
//Personaje
// Declara los personajes. 
//
function Personaje (game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'personaje');
	
    this.anchor.set(0.5, 0.5);  
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.animations.add('stop', [1]);
    this.animations.add('runR',  [2,3,4], 8,true);
    this.animations.add('runL',  [5,6,7], 8,true);
    this.animations.add('jump', [0]);
    //this.animations.add('fall', [4]);
    this.animations.play('stop');
}

Personaje.prototype = Object.create(Phaser.Sprite.prototype);
Personaje.prototype.constructor = Personaje;

Personaje.prototype.move = function(direction){
	const SPEED = 200;
	this.body.velocity.x = direction * SPEED;
};

Personaje.prototype.jump = function(){
	const JUMP_SPEED = 500;
	let canJump = this.body.touching.down;

	if(canJump){
		this.body.velocity.y = -JUMP_SPEED;
	}
	return canJump;
};

Personaje.prototype.bounce = function(){
	const BOUNCE_SPEED=500;
	this.body.velocity.y = -BOUNCE_SPEED;
};

Personaje.prototype._getAnimationName = function () {
    let name = 'stop'; //animacion por defecto

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    
    else if (this.body.velocity.x > 0 && this.body.touching.down) {
        name = 'runR';
    }
    else if (this.body.velocity.x < 0 && this.body.touching.down) {
        name = 'runL';
    }

    return name;
};

Personaje.prototype.update = function () {
    
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Personaje.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('stop', [0], 8, true);
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('golpeado',[4],1, true);
    this.animations.add('die', [4,4,4,3,3,3,3], 6);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 260;

Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

Spider.prototype.AumentarVelocidad = function(){
	this.body.velocity.x = Spider.SPEED=300;
};

Spider.prototype.golpeado = function(){
	this.body.velocity.x = 0;
	this.animations.play('golpeado');
};

Spider.prototype.camina = function(){
	this.animations.play('crawl');
	Spider.SPEED = 260;
};


Spider.prototype.update = function () {
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

PlayState = {};

PlayState.init = function(){
	this.game.renderer.renderSession.roundPixels = true;
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP
	});

	this.keys.up.onDown.add(function(){
		let didJump = this.personaje.jump();
		if(didJump){
			this.sfx.jump.play();
		}
		
	}, this);

	this.coinPickupCount = 0;
	this.liveSpider =4 ; 
	this.hasKey = false;

};

PlayState.preload = function(){
	this.game.load.image('background', 'assets/lvlTres/fondo.png');
	this.game.load.json('level:1', 'data3/level01.json');
	this.game.load.spritesheet('piso', 'assets/lvlTres/piso.png');
	this.game.load.spritesheet('plataforma1', 'assets/lvlTres/plataforma1.png');
	this.game.load.spritesheet('plataforma2', 'assets/lvlTres/plataforma2.png');
	this.game.load.spritesheet('pared', 'assets/lvlTres/pared.png');
	this.game.load.spritesheet('puerta', 'assets/lvlTres/puerta.png');
	this.game.load.spritesheet('personaje', 'assets/lvlTres/personaje.png',30,54);
	this.game.load.spritesheet('coin', 'assets/lvlTres/coin_animated.png',22,22);
	this.game.load.spritesheet('icon:coin', 'assets/lvlTres/coin_icon.png');
	this.game.load.spritesheet('key', 'assets/lvlTres/key.png');
	this.game.load.spritesheet('spider', 'assets/lvlTres/spider.png', 165, 165);
	this.game.load.image('font:numbers', 'assets/lvlTres/numbers.png');
	this.game.load.image('icon:coin', 'assets/lvlTres/coin_icon.png');
	this.game.load.image('icon:spider', 'assets/lvlTres/spider_icon.png');
	this.game.load.spritesheet('icon:key', 'assets/lvlTres/key_icon.png', 34, 30);
	this.game.load.audio('sfx:coin', 'audio/mario-coin.mp3');
	this.game.load.audio('sfx:jump', 'audio/salto.mp3');
    this.game.load.audio('sfx:stomp', 'audio/muertepersonaje.mp3');
    this.game.load.audio('sfx:stompEn', 'audio/muerteenemigo.mp3');
};

PlayState._createHud = function(){
	const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
    NUMBERS_STR, 6);
    this.keyIcon = this.game.make.image(0, 15, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    // ...
  	let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10, 30);
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
    coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    // ...
   
	this.hud.add(this.keyIcon);
    this.hud.add(coinScoreImg);
	
	this.spiderFont = this.game.add.retroFont('font:numbers', 20,26, NUMBERS_STR, 6);
	let spiderIcon = this.game.make.image(0,0, 'icon:spider');
	this.hud = this.game.add.group();
	this.hud.add(spiderIcon);
	this.hud.position.set(800,30); 
	let spiderScoreImg = this.game.make.image(spiderIcon.x + spiderIcon.width, spiderIcon.height/2, this.spiderFont);
	spiderScoreImg.anchor.set(0,0.5);
	this.hud.add(spiderScoreImg);
};

PlayState.create = function(){
	this.sfx ={
		jump: this.game.add.audio('sfx:jump'),
		coin: this.game.add.audio('sfx:coin'),
		stomp: this.game.add.audio('sfx:stomp'),
		stompEn: this.game.add.audio('sfx:stompEn')
	};
	this.game.add.image(0,0, 'background');
	this._loadLevel(this.game.cache.getJSON('level:1'));

	this._createHud();
};

PlayState.update = function(){
	
	this.game.paused=false;
	this._handleCollisions();
	this._handleInput();
	this.coinFont.text = `x${this.coinPickupCount}`;
	this.spiderFont.text = `x${this.liveSpider}`;
};

PlayState._handleCollisions = function(){
	this.game.physics.arcade.collide(this.personaje, this.piso);
	this.game.physics.arcade.collide(this.personaje, this.platforms);
	this.game.physics.arcade.collide(this.spiders, this.piso);
	this.game.physics.arcade.overlap(this.personaje, this.coins, this._onPersonajeVsCoin, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.spiders, this._onPersonajeVsEnemy, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.key, this._onPersonajeVsKey, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.puertas, this._onPersonajeVsPuerta, 
		function(personaje, puerta){
			return this.hasKey && personaje.body.touching.down;
		}, this);
	this.keyIcon.frame = this.hasKey ? 1 : 0;
};

PlayState._onPersonajeVsCoin = function(personaje, coin){
	this.sfx.coin.play();
	coin.kill();
	this.coinPickupCount++;
};

PlayState._onPersonajeVsKey = function(personaje, key){
	key.kill();
	this.hasKey = true;
	$('#modalValor').modal('show');

};

PlayState._onPersonajeVsPuerta = function(personaje, puerta){
	if(this.hasKey=true){
	    $('#modalVideo').modal('show');
	}
};

PlayState._onPersonajeVsEnemy = function(personaje, enemy){
	enemy.camina();
	if(personaje.body.velocity.y >0 ){
			personaje.bounce();
			this.sfx.stompEn.play();
			//enemy.golpeado();
			this.camera.shake(0.01,100);
			this.liveSpider--;
			if(this.liveSpider<=5){
				this.camera.shake(0.01,100);
				enemy.AumentarVelocidad();
				this.sfx.stompEn.play();
			}
			if(this.liveSpider<=0){
				this.camera.shake(0.05,500);
				this.key.visible = true;
				enemy.die();
				this.sfx.stompEn.play();
			}
			
	}else{
		
		this.sfx.stomp.play();
		this.game.state.restart();
	}
};

PlayState._handleInput = function(){
	if(this.keys.left.isDown){
		this.personaje.move(-1);
	}else if(this.keys.right.isDown){
		this.personaje.move(1);
	}else{
		this.personaje.move(0);
	}
	if (this.keys.left.isDown) { // move hero left
        this.personaje.move(-1);
    }else if (this.keys.right.isDown) { // move hero right
        this.personaje.move(1);
	}else{
		this.personaje.move(0);
	}

	 const JUMP_HOLD = 50; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.personaje.jump();
        this.sfx.jump.play();
    }else {
        this.personaje.stopJumpBoost();
    }
    //deteccion del mouse y touch
    if(this.game.input.mousePointer.isDown || this.game.input.activePointer.isDown){
        var halfWidth = this.game.width/2;
        var halfHeight = this.game.height/2;
        //izquerda
       
        if(this.game.input.mousePointer.x <500|| this.input.x<500 ){
             this.personaje.move(-1);
        }else if(this.game.input.mousePointer.x>500 || this.input.x>500){
             this.personaje.move(1);
        }else{
            this.personaje.move(0);
        }
        const JUMP_HOLD = 100;
        if(this.game.input.mousePointer.y<halfHeight||this.input.y<100){
         let didJump = this.personaje.jump();
         this.sfx.jump.play();
          this.personaje.stopJumpBoost();
        }
    }
};

PlayState._loadLevel = function(data){
	this.piso = this.game.add.group();
	data.piso.forEach(this._spawnPiso, this);
	this.platforms = this.game.add.group();
	data.platforms.forEach(this._spawnPlatform, this);
	this.bgDecoration = this.game.add.group();
	this.puertas = this.game.add.group();
	data.puertas.forEach(this._spawnPuerta, this);
	this.coins = this.game.add.group();
	this.spiders = this.game.add.group();
	this._spawnKey(data.Keys.x, data.Keys.y);
	this._spawnCharacters({personaje: data.personaje, spiders: data.spiders});
	data.coins.forEach(this._spawnCoin, this);


	
	const GRAVITY = 1200;
	this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnPiso = function(piso){
	let sprite = this.piso.create(
		piso.x, piso.y, piso.assets);

	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};

PlayState._spawnPlatform = function(platform){
	let sprite = this.platforms.create(
		platform.x, platform.y, platform.assets);

	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};

PlayState._spawnCharacters = function(data){
	this.personaje = new Personaje(this.game, data.personaje.x, data.personaje.y);
	this.game.add.existing(this.personaje);


 	data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);
};

PlayState._spawnPuerta = function(puerta){
	let sprite = this.puertas.create(
		puerta.x, puerta.y, puerta.assets);

	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
};

PlayState._spawnCoin = function(coin){
	let sprite = this.coins.create(coin.x, coin.y, 'coin');
	sprite.anchor.set(0.5,0.5);
	sprite.animations.add('rotate', [0,1,2,1], 6, true);
	sprite.animations.play('rotate');
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(-30, -1);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    this.key.visible = false;

    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 40}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

window.onload = function(){
	let game = new Phaser.Game(960,550, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play'); 
};