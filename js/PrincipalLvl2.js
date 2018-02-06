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

function Anciano(game, x, y){ // personaje 
	Phaser.Sprite.call(this, game, x, y, 'anciano');

	this.animations.add('run',  [0,1,2,3,4], 4,true);
	this.animations.add('stop', [0], 4, true);
    this.animations.play('stop');

	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.velocity.x = Anciano.SPEED;  //velocidad de x 
	this.body.velocity.y = Anciano.SPEEDY; // velocidad de y
}

console.log('rwsedakjohfsdkjh');
	Anciano.SPEED = 0; // para que el viejo no parta caminando
console.log(this.colBotonA+'cdf');
if(this.colBotonA){
}

Anciano.SPEEDY=-150;  // - sube

Anciano.prototype = Object.create(Phaser.Sprite.prototype);
Anciano.prototype.constructor = Anciano;


Anciano.prototype.move = function(direction){   
console.log('direction'+direction);
if (direction==1) {

Anciano.SPEED = 30;
	const SPEED = 30;
	this.body.velocity.x = SPEED * direction;
	this.animations.play('run');
}         
else{

Anciano.SPEED = 0;
	const SPEED = 0;
	this.body.velocity.x = SPEED * direction;
	this.animations.play('stop');
}     
	
};

Anciano.prototype.quieto =function(){
	if(colBotonA=true){
		this.body.enable= false;
	    this.animations.play('stop');
	    this.body.velocity.x=0;
	    this.body.velocity.y=0;
	}
};

Anciano.prototype.update = function (direction) {
	
	if (this.body.touching.right|| this.body.blocked.right ) {
        this.body.velocity.y =Anciano.SPEEDY;
        this.body.velocity.x=Anciano.SPEED;
   }
};

PlayState = {};

PlayState.init = function(){
	
	this.game.renderer.renderSession.roundPixels = true;

	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP,
		spaceBar: Phaser.KeyCode.SPACEBAR,
		a: Phaser.KeyCode.A 

	});

	this.keys.up.onDown.add(function(){
		let didJump = this.personaje.jump();
		this.sfx.jump.play();

		if(didJump){
			this.sfx.jump.play();
		}
	}, this);



	this.coinPickupCount = 0;
	this.colBotonA = false;

};

PlayState.preload = function(){
	this.game.load.json('level:1', 'data2/level01.json');

	this.game.load.image('background', 'assets/lvlDos/fondo.png');
	this.game.load.spritesheet('piso1', 'assets/lvlDos/piso1.png');
	this.game.load.spritesheet('piso2', 'assets/lvlDos/piso2.png');
	this.game.load.spritesheet('piso3', 'assets/lvlDos/piso3.png');
	this.game.load.spritesheet('piso4', 'assets/lvlDos/piso4.png');
	this.game.load.spritesheet('piso5', 'assets/lvlDos/piso5.png');
	this.game.load.spritesheet('piso6', 'assets/lvlDos/piso6.png');
	this.game.load.spritesheet('piso7', 'assets/lvlDos/piso7.png');
	this.game.load.spritesheet('piso8', 'assets/lvlDos/piso8.png');
	this.game.load.spritesheet('piso9', 'assets/lvlDos/piso9.png');
	this.game.load.spritesheet('piso10', 'assets/lvlDos/piso10.png');
	this.game.load.spritesheet('piso11', 'assets/lvlDos/piso11.png');
	this.game.load.spritesheet('piso12', 'assets/lvlDos/piso12.png');
	this.game.load.spritesheet('piso13', 'assets/lvlDos/piso13.png');
	this.game.load.spritesheet('piso14', 'assets/lvlDos/piso14.png');
	this.game.load.spritesheet('piso15', 'assets/lvlDos/piso15.png');
	this.game.load.spritesheet('plataforma1', 'assets/lvlDos/plataforma1.png');
	this.game.load.spritesheet('plataforma2', 'assets/lvlDos/plataforma2.png');
	this.game.load.spritesheet('plataforma3', 'assets/lvlDos/plataforma3.png');
	this.game.load.spritesheet('boton', 'assets/lvlDos/boton.png', 33,32);
	this.game.load.spritesheet('boton2', 'assets/lvlDos/boton2.png', 33,32);
	this.game.load.spritesheet('boton3', 'assets/lvlDos/boton3.png', 33,32);
	this.game.load.spritesheet('boton4', 'assets/lvlDos/boton4.png', 33,32);
	this.game.load.spritesheet('bandera', 'assets/lvlDos/bandera.png');
	this.game.load.spritesheet('puente1', 'assets/lvlDos/puente1.png');
	this.game.load.spritesheet('puente2', 'assets/lvlDos/puente2.png');
	this.game.load.spritesheet('personaje', 'assets/lvlDos/personaje.png', 30,54);
	this.game.load.spritesheet('anciano', 'assets/lvlDos/anciano.png',30,45);
	this.game.load.spritesheet('puas1', 'assets/lvlDos/puas1.png');
	//this.game.load.spritesheet('spider', 'assets/spider.png',85,70);
	this.game.load.spritesheet('paredEnemiga', 'assets/lvlDos/paredEnemiga.png');
	this.game.load.spritesheet('coin', 'assets/lvlDos/coin_animated.png', 22, 22);
	this.game.load.image('font:numbers', 'assets/lvlDos/numbers.png');
	this.game.load.image('icon:coin', 'assets/lvlDos/coin_icon.png');
	this.game.load.image('key', 'assets/lvlDos/key.png');
	this.game.load.spritesheet('icon:key', 'assets/lvlDos/key_icon.png', 34, 30);
	this.game.load.audio('sfx:jump', 'audio/salto.mp3');
	this.game.load.audio('sfx:coin', 'audio/mario-coin.mp3');
	this.game.load.audio('sfx:stomp', 'audio/muertepersonaje.mp3');
	
	//this.game.load.audio('sfx:puente', 'audio/puente.mp3');
	this.game.load.image('menu', 'assets/lvlDos/continuar.png');

};

PlayState._createHud = function(){
	const NUMBERS_STR = '0123456789X';
	this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);
	let coinIcon = this.game.make.image(0, 0, 'icon:coin');

	this.hud = this.game.add.group();
	this.hud.add(coinIcon);
	this.hud.position.set(10,10);

	let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height/2, this.coinFont);
	coinScoreImg.anchor.set(0, 0.5);

	this.hud.add(coinScoreImg);
};

PlayState.create = function(){
	this.game.add.image(0,0, 'background');
	
	this._loadLevel(this.game.cache.getJSON('level:1'));
	//emitter.start(false, 5000, 20);

	this.sfx ={
		jump: this.game.add.audio('sfx:jump'),
		coin: this.game.add.audio('sfx:coin'),
		stomp: this.game.add.audio('sfx:stomp'),
	
		puente: this.game.add.audio('sfx:puente')
	};

	this._createHud();
	
	//pause_label= game.add.text(100, 20, 'Pause', {font:'24p'})

};

PlayState.update = function(){
	
	this.puente1.visible = false;  //puentes invisibles
	this.puentes2.visible = false;
	this._handleCollisions();
	
	
	this._handleinput();




		this.coinFont.text = `x${this.coinPickupCount}`;
		this.ColisionBoton = `x${this.colBotonA}`;
	
};

PlayState.detectoColisionBotP=function(){ // personaje
	if (this.game.physics.arcade.overlap(this.personaje, this.botons, this._onPersonajeVsBoton, null, this)||
		this.game.physics.arcade.overlap(this.personaje, this.botons2, this._onPersonajeVsBoton2, null, this)) {
		return true;
	}
	else{
		return false;
	}
};

PlayState.ColisionBoton = function(){
	var botonCol =this.detectoColisionBot();
	
	if (this.keys.spaceBar.isDown && botonCol) {

		this.puentes.visible = true;
		this.puentes2.visible = true;
		this._handleCollisions2();
		
	}
};

PlayState.detectoColisionBotA = function(){
	if (this.game.physics.arcade.overlap(this.anciano, this.botons3, this._onAncianoVsBoton3, null, this)||
	    this.game.physics.arcade.overlap(this.anciano, this.botons4, this._onAncianoVsBoton4, null, this)) {
		return true;
	}
	else{
		return false;
	}
};

PlayState.ColisionBotonA = function(){
	var botonColA =this.detectoColisionBotA();
	
	if (botonColA) {
		
		this.puentes.visible = true;
		this.puentes2.visible = true;
		this._handleCollisions3();
	}
};


PlayState._handleCollisions = function(){ 
	this.game.physics.arcade.collide(this.personaje, this.platforms);
	this.game.physics.arcade.collide(this.anciano, this.platforms);
	//this.game.physics.arcade.overlap(this.anciano, this.paredEnemiga, this._onAncianoVsPared, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.coins, this._onPersonajeVsCoin, null, this);
	
	this.game.physics.arcade.overlap(this.personaje, this.botons, this._onPersonajeVsBoton, null, this);
		
	this.game.physics.arcade.overlap(this.personaje, this.botons2, this._onPersonajeVsBoton2, null, this);
	this.game.physics.arcade.overlap(this.anciano, this.botons3, this._onAncianoVsBoton3, null, this);
	this.game.physics.arcade.overlap(this.anciano, this.botons4, this._onAncianoVsBoton4, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.banderas, this._onPersonajeVsBandera, null, this);
	this.game.physics.arcade.overlap(this.anciano, this.puas, this._onAncianoVsPuas, null, this);
	this.game.physics.arcade.overlap(this.anciano, this.banderas, this._onAncianoVsBandera, null, this);
	this.game.physics.arcade.overlap(this.personaje, this.puas, this._onPersonajeVsPuas, null, this);
};

PlayState._handleCollisions2 = function(){
	this.game.physics.arcade.collide(this.anciano, this.puente1);
	this.game.physics.arcade.collide(this.anciano, this.puentes2);
	
};

PlayState._handleCollisions3 = function(){

	this.game.physics.arcade.collide(this.personaje, this.puente1);
	
};

PlayState._handleCollisions4 = function(){
	this.game.physics.arcade.collide(this.personaje, this.puentes2);
};


PlayState._onPersonajeVsCoin = function(personaje, coin){
	this.coinPickupCount++;
	this.sfx.coin.play();
	coin.kill();
};

PlayState._onPersonajeVsBandera = function(personaje, bandera){
	if(this.puentes2.visible=true){
		bandera.kill();
	$('#modalValor').modal('show');
	}
	
};

PlayState._onPersonajeVsBoton = function(personaje, boton){
	if(this.puente1.visible != true){
		    
		this._handleCollisions2();
		this.puente1.visible = true;
		
		//this.sfx.puente.play();
		this._spawnBoton(boton);
		this.anciano.move(1);
		estado = 1;		
	}
				
	
};

PlayState._actionPuente = function(personaje, boton){
		if(this.puente1.visible != true){
		    
		this._handleCollisions2();
		this.puente1.visible = true;
		
		//this.sfx.puente.play();
		this._spawnBoton(boton);
		this.anciano.move(1);
		estado = 1;		
	}
		
	
};
	

PlayState._onPersonajeVsBoton2 = function(personaje, boton){

		if(this.puentes2.visible != true){
		    
		this._handleCollisions2();
		this.puentes2.visible = true;
		this.puente1.visible=false;
		//this.sfx.puente.play();
		this._spawnBoton(boton);
		this.anciano.move(1);
		estado = 1;		
	}
};

PlayState._onAncianoVsBoton3 = function(anciano, boton3){
		if(this.game.physics.arcade.overlap(this.personaje, this.botons2, this._onPersonajeVsBoton2, null, this)){
			this.anciano.move(1);
			
		}else{
			this.anciano.move(0);
			this._handleCollisions3();
			this.puente1.visible = true;
			
			//this.sfx.puente.play();
			//this.puentes2.visible = true;
			
		}
};



PlayState._onAncianoVsBoton4 = function(anciano, boton4){
	if(this.game.physics.arcade.overlap(this.personaje, this.banderas, this._onPersonajeVsBandera, null, this))
	{
		this.anciano.move(1);
	}else{
		this.anciano.move(0);
			this._handleCollisions4();
			this.puentes2.visible = true;
			//this.puentes2.visible = true;
			
			this.sfx.puente.play();
	}
	
};			

PlayState._onAncianoVsPuas = function(anciano, puas){
	 $('#modalAnciano').modal('show');

	 
	 this.game.state.restart();
	 if(this.game.state.restart()){
	 	anciano.move(0);
	 }



};

PlayState._onAncianoVsBandera = function(anciano, bandera){
	anciano.move(0);
};
PlayState._onPersonajeVsPuas =function(personaje, puas){
	this.sfx.stomp.play();
	this.game.state.restart();
	if(this.game.state.restart()){
	 	anciano.move(0);
	 }

//location.reload();
};




PlayState._handleinput = function(){
	
	if(this.keys.left.isDown){
		this.personaje.move(-1);
	}
	else if(this.keys.right.isDown){
		this.personaje.move(1);
	}else{
		this.personaje.move(0);
	}
	if (this.keys.left.isDown) { // move hero left
        this.personaje.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.personaje.move(1);
	}
	else{
		this.personaje.move(0);
	}

	 const JUMP_HOLD = 50; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.personaje.jump();
        this.sfx.jump.play();
        
    }
    else {
        this.personaje.stopJumpBoost();
    }
    //deteccion del mouse y touch
   if(this.game.input.mousePointer.isDown || this.game.input.activePointer.isDown){ //mouse, el active pointer hace el touch de telefono
        var halfWidth = this.game.width/2;  // se divide la pantalal para ver donde va el click
        var halfHeight = 300;
        //izquerda
        
        if(this.game.input.mousePointer.x <500 && this.input.x<275 ){
            this.personaje.move(-1);
        }else if(this.game.input.mousePointer.x>500 || this.input.x>275){
            this.personaje.move(1);

        }else{
            this.personaje.move(0);
        }
        const JUMP_HOLD = 100;
        if(this.game.input.mousePointer.y>halfHeight||this.input.y<200){
            let didJump = this.personaje.jump();
            this.sfx.jump.play();
            this.personaje.stopJumpBoost();
        }
       
    }
};

PlayState._spawnPuente = function(puente1){
	let sprite = this.puente1.create(
		puente1.x, puente1.y, puente1.assets);
	sprite.anchor.set(0.5, 0.5);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
	
	this.puente1.visible = false;

	
};

PlayState._spawnPuente2 = function(puente2){
	let sprite = this.puentes2.create(
		puente2.x, puente2.y, puente2.assets);
	sprite.anchor.set(0.5, 0.5);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
	
	this.puentes2.visible = false;
};

PlayState._spawnPlatform = function(platform){
	
	let sprite = this.platforms.create(
		platform.x, platform.y, platform.assets);

	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;
	this.game.add.sprite(platform.x, platform.y, platform.assets);
	
};

var estado=0;

PlayState._spawnBoton = function(boton){
	console.log('skjdhksjhd');
	if(this.game.physics.arcade.collide(this.anciano, this.puente1)){
	estado=1;	
		let sprite = this.botons.create(boton.x, boton.y, 'boton');
		sprite.anchor.set(0.5,0.5);
		sprite.animations.add('desactivado', [0], 6, true);
		sprite.animations.add('activado', [1], 6, true);
		sprite.animations.play('activado');
		this.game.physics.enable(sprite);
	    sprite.body.allowGravity = false;
	}else{
		estado=0;
			let sprite = this.botons.create(boton.x, boton.y, 'boton');
			sprite.anchor.set(0.5,0.5);
			sprite.animations.add('desactivado', [0], 6, true);
			sprite.animations.add('activado', [1], 6, true);
			sprite.animations.play('desactivado');
	

			this.game.physics.enable(sprite);
			sprite.body.allowGravity = false;
		}

	
	
		

	
		
	 
};

PlayState._spawnBoton2 = function(boton){
	var a = true;
	if (a= true && this.keys.spaceBar.isDown) {	
				
		let sprite = this.botons2.create(boton.x, boton.y, 'boton');
		sprite.anchor.set(0.5,0.5);
		sprite.animations.add('desactivado', [0], 6, true);
		sprite.animations.add('activado', [1], 6, true);
		sprite.animations.play('activado');
		this.game.physics.enable(sprite);
	    sprite.body.allowGravity = false;
	}else{
			let sprite = this.botons2.create(boton.x, boton.y, 'boton');
			sprite.anchor.set(0.5,0.5);
			sprite.animations.add('desactivado', [0], 6, true);
			sprite.animations.add('activado', [1], 6, true);
			sprite.animations.play('desactivado');
	

			this.game.physics.enable(sprite);
			sprite.body.allowGravity = false;
		}
	
};

PlayState._spawnBoton3 = function(boton3){
	var a = true;
	if (a= true && this.keys.a.isDown) {	
				
		let sprite = this.botons3.create(boton3.x, boton3.y, 'boton3');
		sprite.anchor.set(0.5,0.5);
		sprite.animations.add('desactivado', [0], 6, true);
		sprite.animations.add('activado', [1], 6, true);
		sprite.animations.play('activado');
		this.game.physics.enable(sprite);
	    sprite.body.allowGravity = false;
	    sprite.body.immovable= true;
	}else{
			let sprite = this.botons3.create(boton3.x, boton3.y, 'boton3');
			sprite.anchor.set(0.5,0.5);
			sprite.animations.add('desactivado', [0], 6, true);
			sprite.animations.add('activado', [1], 6, true);
			sprite.animations.play('desactivado');
	

			this.game.physics.enable(sprite);
			sprite.body.allowGravity = false;
		}
	
};

PlayState._spawnBoton4 = function(boton4){
	var a = true;
	if (a= true && this.keys.a.isDown) {	
				
		let sprite = this.botons4.create(boton4.x, boton4.y, 'boton4');
		sprite.anchor.set(0.5,0.5);
		sprite.animations.add('desactivado', [0], 6, true);
		sprite.animations.add('activado', [1], 6, true);
		sprite.animations.play('activado');
		this.game.physics.enable(sprite);
	    sprite.body.allowGravity = false;
	}else{
			let sprite = this.botons4.create(boton4.x, boton4.y, 'boton4');
			sprite.anchor.set(0.5,0.5);
			sprite.animations.add('desactivado', [0], 6, true);
			sprite.animations.add('activado', [1], 6, true);
			sprite.animations.play('desactivado');
	

			this.game.physics.enable(sprite);
			sprite.body.allowGravity = false;
		}
	
};

PlayState._spawnPuas = function(puas){
	let sprite = this.puas.create(
		puas.x, puas.y, puas.assets);
	sprite.anchor.set(0.5, 0.5);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
};


PlayState._spawnCharacters = function(data){
	this.personaje = new Personaje(this.game, data.personaje.x, data.personaje.y);
	this.game.add.existing(this.personaje);

	this.anciano = new Anciano(this.game, data.anciano.x, data.anciano.y);
	this.game.add.existing(this.anciano);
};

PlayState._spawnCoin = function(coin){
	let sprite = this.coins.create(coin.x, coin.y, 'coin');
	sprite.anchor.set(0.5,0.5);
	sprite.animations.add('rotate', [0,1,2,1], 6, true);
	sprite.animations.play('rotate');

	this.game.physics.enable(sprite);
	sprite.body.allowGravity= false;

};

PlayState._spawnBandera = function(bandera){
	let sprite = this.banderas.create(
		bandera.x, bandera.y, 'bandera');
	sprite.anchor.set(0.5, 0.5);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
};

PlayState._loadLevel = function(data){
	
	this.platforms = this.game.add.group();
	this.coins = this.game.add.group();
	this.botons = this.game.add.group();
	this.botons2 = this.game.add.group();
	this.botons3 = this.game.add.group();
	this.botons4 = this.game.add.group();
	this.puas = this.game.add.group();
	this.puente1 = this.game.add.group();
	this.puentes2 = this.game.add.group();
	this.banderas = this.game.add.group();
	data.banderas.forEach(this._spawnBandera,this);
	data.platforms.forEach(this._spawnPlatform, this);
	data.botons.forEach(this._spawnBoton, this);
	data.botons2.forEach(this._spawnBoton2, this);
	data.botons3.forEach(this._spawnBoton3, this);
	data.botons4.forEach(this._spawnBoton4, this);
	data.puas.forEach(this._spawnPuas, this);
	
	data.coins.forEach(this._spawnCoin, this);
	data.puente1.forEach(this._spawnPuente, this);
	data.puentes2.forEach(this._spawnPuente2, this);
	
	

	this._spawnCharacters({personaje: data.personaje, anciano: data.anciano});


	const GRAVITY = 1560;
	this.game.physics.arcade.gravity.y = GRAVITY;

};


window.onload = function(){
	let game = new Phaser.Game(960,550, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play');
	game.state.paused=true
};