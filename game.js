class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.enemys = [];
    this.nextEnemy = 50;
    this.count = 0;

    this.score = 0;

    this.isGameOver = false;
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.player = new Character("./img/avatar.png",150,400,64);

    this.grounds = [
      new Block("./img/ground.png",0,464),
      new Block("./img/ground.png",256,464),
      new Block("./img/ground.png",512,464),
      new Block("./img/ground.png",768,464),
    ];

    this.loop = setInterval(()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.update();
      this.draw();

      this.score += 0.2;
      this.count ++;
    },20);
  }

  /**
   * ゲームの終了
   */
  stop(){
    clearInterval(this.loop);
    this.isGameOver = true;
  }

  /**
   * 更新
   */
  update(){
    this.player.speedY += this.player.accY;
    this.player.posY += this.player.speedY;

    if(this.player.posY > 400){
      this.player.posY = 400;
      this.player.speedY = 0;
      this.player.accY = 0;
    }

    this.enemys.forEach(enemy=>{
      enemy.speedX += 0.001;
      enemy.posX -= Math.round(enemy.speedX);

      const diffX = this.player.posX - enemy.posX;
      const diffY = this.player.posY - enemy.posY;
      if(Math.sqrt(diffX*diffX + diffY*diffY) <= this.player.size + enemy.size){
        this.stop();
      }
    });

    this.enemys.filter(e=>e.posX > -100);

    if(this.count === this.nextEnemy){
      this.genEnemy();
      this.nextEnemy += Math.floor(80*Math.random()) + 50;
    }
  }

  /**
   * 描画
   */
  draw(){
    this.player.draw(this.ctx);
    this.enemys.forEach(e=>e.draw(this.ctx));

    this.grounds.forEach(g=>g.draw(this.ctx));

    //スコア
    this.ctx.font = "20pt Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`SCORE: ${Math.round(this.score)}`,600,50);
  }

  genEnemy(){
    const enemy = this.random([
      new Character("./img/enemy1.png",1000,400 - (Math.random() > 0.75 ? 140 : 0),60),
      new Character("./img/enemy2.png",1000,420,40)
    ]);

    enemy.speedX = 15*Math.random()+10;

    this.enemys.push(enemy);
  }

  key(event){
    if(this.isGameOver){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

      this.enemys = [];
      this.nextEnemy = 0;
      this.count = 0;

      this.isGameOver = false;

      this.start();
    }else if(event.code === "Space"){
      if(this.player.posY !== 400) return;
      
      this.player.speedY = -30;
      this.player.accY = 1.5;
    }
  }

  random(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }
}

class Character{
  constructor(img,posX,posY,size){
    this.image = new Image();
    this.image.src = img;

    this.posX = posX;
    this.posY = posY;

    this.speedX = 0;
    this.speedY = 0;

    this.accX = 0;
    this.accY = 0;

    this.size = size;
  }

  draw(ctx){
    ctx.drawImage(
      this.image,
      this.posX - this.image.width/2,
      this.posY - this.image.height/2
    );
  }
}

class Block{
  constructor(img,posX,posY){
    this.image = new Image();
    this.image.src = img;

    this.posX = posX;
    this.posY = posY;
  }

  draw(ctx){
    ctx.drawImage(
      this.image,
      this.posX,
      this.posY
    );
  }
}

const game = new Game();
game.start();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});