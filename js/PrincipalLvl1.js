//Juego Desarrollado por Verónica Carolina Morales Pino
//06/02/2018
//Librerias utilizadas bootstrap.js, bootstrap.min.css,
// bootstrap.min.js, jquery-2.1.1.min.js, phaser.js, phaser.min.js
//Carga desde json
//Personaje
// Declara los personajes. 
//
function Personaje(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'personaje'); // donde se ubica la pantalla, no es muy relevante en el json puedes darle otra ubicacion.
	this.anchor.set(0, 0);// activa la fisica, que choque, caiga, movimiento.
	this.game.physics.enable(this);// activa las colisiones con el juego. asi no sale de la pantalla
	this.body.collideWorldBounds = true;   // activa las colisiones con el juego. asi no sale de la pantalla

    this.animations.add('stop', [1]);  // se carga la posicion de los sprite
    this.animations.add('runR',  [2,3,4], 8,true);
    this.animations.add('runL',  [5,6,7], 8,true);
    this.animations.add('jump', [0]);
    //this.animations.add('fall', [4]);
    this.animations.play('stop');
    
    this.game.physics.enable(this);
    this.game.physics.startSystem(Phaser.Physics.ARCADE); // activa la fisica global del juego
    this.game.physics.enable(this, Phaser.Physics.ARCADE);  // para seguir con la camara.
   
    this.body.velocity.x = Personaje.SPEED;  //velocidad horizontal del personaje
}

Personaje.prototype = Object.create(Phaser.Sprite.prototype);  // se crea sprite desde phaser
Personaje.prototype.constructor = Personaje;    // personaje

//Movimiento del personaje
Personaje.prototype.move = function (direction) { // se le da una velocidad que es la direccion con la velocidad.
	const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
};

Personaje.prototype.jump = function () {  // igual que velocidad pero para saltar.
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;
    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }
    return canJump;
};

Personaje.prototype.bounce = function () {   //rebota el personaje
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

//Animaciones
Personaje.prototype._getAnimationName = function () {  // se le da nombre a animaciones. 
    let name = 'stop'; //animacion por defecto
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }else if (this.body.velocity.x > 0 && this.body.touching.down) {
        name = 'runR';
    }else if (this.body.velocity.x < 0 && this.body.touching.down) {
        name = 'runL';
    }
    return name;
};

Personaje.prototype.update = function () {   //toma las animaciones de arriba aqui se ejecutan las animaciones.
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Personaje.prototype.stopJumpBoost = function () { // para que deje de saltar
    this.isBoosting = false;
};

//Enemigo
function Spider(game, x, y) {  // animaciones
    Phaser.Sprite.call(this, game, x, y, 'spider');
    this.anchor.set(0.5);
    this.animations.add('crawl', [0, 1, 2], 8, true);// camina
    this.animations.add('die', [4,4,3,3], 6);
    this.animations.play('crawl');

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}
Spider.SPEED = 60;

Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

//Muerte del enemigo
Spider.prototype.die = function () { // muere
    this.body.enable = false;// desactiva fisica
    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

//esto hace que cuando el enemigo choque con una muralla se mueva para el otro
Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

//Estados de Juego
PlayState = {}; // estado del juego. 

//Declaracion de las teclas
PlayState.init = function () {
   
    this.coinPickupCount = 0;   // define que las monedas van en cero
    this.liveSpider= 4;
    
    this.game.renderer.renderSession.roundPixels = true;  // para que el personaje no se vea borroso
    this.keys = this.game.input.keyboard.addKeys({// se declaran las teclas a utilizar.
        left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP 
	});
	
	this.keys.up.onDown.add(function () {
        let didJump = this.personaje.jump();   // hace que el personaje salte con la tecla hacia arriba
    }, this);
};

//Carga de imagenes sonidos y sprites
PlayState.preload = function () {  // toma toda la ruta de las imagenes, json y sonido
	this.game.load.json('level:1', 'data/level01.json'); 
	this.game.load.image('background', 'assets/lvlUno/fondoMontanas.png');
	this.game.load.image('invisible-wall', 'assets/lvlUno/invisible_wall.png');
	this.game.load.image('ground', 'assets/lvlUno/ground.png');
    this.game.load.image('grass:8x1', 'assets/lvlUno/grass_8x1.png');
    this.game.load.image('grass:6x1', 'assets/lvlUno/grass_6x1.png');
    this.game.load.image('grass:4x1', 'assets/lvlUno/grass_4x1.png');
    this.game.load.image('grass:2x1', 'assets/lvlUno/grass_2x1.png');
	this.game.load.image('grass:1x1', 'assets/lvlUno/grass_1x1.png');
	this.game.load.spritesheet('personaje', 'assets/lvlUno/personaje.png',30,54);
	this.game.load.spritesheet('coin', 'assets/lvlUno/coin_animated.png', 22, 22);
    this.game.load.image('icon:coin', 'assets/lvlUno/coin_icon.png');
    this.game.load.image('icon:spider', 'assets/lvlUno/spider_icon.png');
    this.game.load.image('font:numbers', 'assets/lvlUno/numbers.png');
	this.game.load.spritesheet('spider', 'assets/lvlUno/spider.png', 85, 70);
    this.game.load.spritesheet('bandera', 'assets/lvlUno/bandera.png');
    this.game.load.audio('sfx:coin', 'audio/mario-coin.mp3');
	this.game.load.audio('sfx:jump', 'audio/salto.mp3');
    this.game.load.audio('sfx:stomp', 'audio/muertepersonaje.mp3');
    this.game.load.audio('sfx:stompEn', 'audio/muerteenemigo.mp3');
    this.game.load.image('continuar', 'assets/lvlUno/continuar.png');
};

//Marcador
PlayState._createHud = function(){   // marcador de las monedas
    const NUMBERS_STR = '0123456789X';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);
    let coinIcon = this.game.make.image(0, 0, 'icon:coin');
    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10,10); // posicion pantalla
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height/2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);
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

// creacion de las entidades mas importantes del juego
PlayState.create = function () {
  
    this.game.add.image(0, 0, 'background');  // fondo, esta en -700 por el ancho de la imagen
    this._loadLevel(this.game.cache.getJSON('level:1'));
    this.game.camera.follow(this.personaje);
    this.sfx = { // sfx es como esta declarado y : extencion del sonido
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        stompEn: this.game.add.audio('sfx:stompEn')      
    };
    this._createHud();
    //this._createPause();

  

};

/*PlayState._createPause = function(){
    let pauseIcon = this.game.make.image(0, 0, 'continuar');
    this.pause = this.game.add.group();
    this.pause.add(pauseIcon);
    this.pause.position.set(400,100);
    pauseIcon.anchor.set(0.5);
    pauseIcon.inputEnabled = true

 

    if(pauseIcon.onInputDown){
        console.log('se pulso');
    }
}/*/

//colision, entrada por teclado y marcador
PlayState.update = function () {
   //this.game.paused = true;
    this._handleCollisions(); //que colisione, que tome la moneda, mate al enemigo etc
    this._handleInput();  //recibe las teclas para mover el personaje
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.spiderFont.text = `x${this.liveSpider}`;
  //  this.pausa = `x${this.habilitarJuego}`;
};

//Colisiones
PlayState._handleCollisions = function () {
	this.game.physics.arcade.collide(this.personaje, this.platforms);
	this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.overlap(this.personaje, this.coins, this._onPersonajeVsCoin,null, this);
    this.game.physics.arcade.overlap(this.personaje, this.spiders,this._onPersonajeVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.personaje, this.banderas, this._onPersonajeVsBandera,null, this);
};

PlayState._onPersonajeVsBandera = function(personaje, bandera){
    if(this.liveSpider<=0 ){
        bandera.kill(); // se borra la bandera
        $('#modalValor').modal('show'); // y carga el modal
       
    }
};

PlayState._onPersonajeVsCoin = function (personaje, coin) {
    this.coinPickupCount++;  // suma la moneda al marcador
    coin.kill();
      this.sfx.coin.play(); // se ejcuta el sonido
};

PlayState._onPersonajeVsEnemy = function (personaje, enemy) {
   if (personaje.body.velocity.y > 0) { // ve q el personaje este en la misma posicion del enemigo
      this.sfx.stompEn.play();
       enemy.die();
       personaje.bounce();
       this.liveSpider--;
    }else{   // si no carga otro sonido y vuelve  amepzar el juego // si se presiona la teca -1 es izquierda
        this.sfx.stomp.play();
        this.game.state.restart();
    }
    if (personaje.body.velocity.y > 0) {
        personaje.bounce();
    }
};

//Movimiento por teclado
PlayState._handleInput = function () {
    if (this.keys.left.isDown) {  // si se presiona la tecla -1 es izquierda
        this.personaje.move(-1);
    }else if (this.keys.right.isDown) { // 1 derecha
        this.personaje.move(1);
	}else{
		this.personaje.move(0); // 0 que para
	}
	 const JUMP_HOLD = 50; // ms salto
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.personaje.jump();
        this.sfx.jump.play();
        
    }else {
        this.personaje.stopJumpBoost(); // personaje solo salta cuando toca el suelo
    }
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

//Murallas para los enemigos, no se carga en el data pero si esta en el juego
PlayState._spawnEnemyWall = function (x, y, side) {  // murallas para que el enemigo no se caiga
    let sprite = this.enemyWalls.create(x, y, 'invisible_wall');
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

//Plataformas
PlayState._spawnPlatform = function (platform) {
    this.game.add.sprite(platform.x, platform.y, platform.assets); //se añade el sprite y le da la posicion segun el data
	let sprite = this.platforms.create(  // se genera como grupo, no independiente
        platform.x, platform.y, platform.assets);
	this.game.physics.enable(sprite); // fisica
	sprite.body.allowGravity = false;  // desactiva gra vedad
    sprite.body.immovable = true; // desactiva movimiento, colisiona con el pj pero no se mueve la plataforma
    this._spawnEnemyWall(platform.x, platform.y, 'left');  //muralla, invisble
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

//Personajes
PlayState._spawnCharacters = function (data) { // se carga la araña y el personaje, juntas pq estan creadas como personajes deparados
    this.personaje = new Personaje(this.game, data.personaje.x, data.personaje.y);
    this.game.add.existing(this.personaje);
    data.spiders.forEach(function (spider) {  // grupo de arañas
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);
};

//Moneda
PlayState._spawnCoin = function (coin) {   // animacion, ubicacion 
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
	sprite.anchor.set(0.5, 0.5);
	sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
	sprite.animations.play('rotate');
	this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

//Bandera
PlayState._spawnBandera = function(bandera){ // se creo como grupo
    let sprite = this.banderas.create(
        bandera.x, bandera.y, 'bandera');// se pone el nombre como se declaro en las img
    sprite.anchor.set(0.5, 0.5);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

//Carga el nivel completo 
PlayState._loadLevel = function (data) { 
    this.bgDecoration = this.game.add.group();   //se declaran todos los grupos, tiene un orden
    this.banderas = this.game.add.group();
    data.banderas.forEach(this._spawnBandera,this);
    this.enemyWalls = this.game.add.group();
    this.platforms = this.game.add.group();
    data.platforms.forEach(this._spawnPlatform, this);
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls.visible = false;
    this._spawnCharacters({personaje: data.personaje, spiders: data.spiders});

    //Gravedad
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY; // gravedad vertical
    data.coins.forEach(this._spawnCoin, this); // siempre se cargan al final las moendas
};

//le da comienzo al juego
window.onload = function () {
  
    let game = new Phaser.Game(960, 550, Phaser.AUTO, 'game'); // tamaño, canvas automatico, nombre del div del index
    game.state.add('play', PlayState);
    game.state.start('play');  // el juego inicia con el play
 
};

