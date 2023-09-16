class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.score = 0;
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.player = new Character("./img/avatar.png",150,400,64);
    this.enemy = new Character("./img/enemy.png",1200,400,64);

    this.enemy.speedX = 15;

    this.loop = setInterval(()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.update();
      this.draw();

      this.score += 0.25;
    },20);
  }

  /**
   * ゲームの終了
   */
  stop(){
    clearInterval(this.loop);
  }

  /**
   * 更新
   */
  update(){
    this.player.speedY += this.player.accY;
    this.player.posY += this.player.speedY;

    if(this.player.posY > this.player.initPosY){
      this.player.posY = this.player.initPosY;
      this.player.speedY = 0;
      this.player.accY = 0;
    }

    this.enemy.speedX += 0.005;
    this.enemy.posX -= Math.round(this.enemy.speedX);
    if(this.enemy.posX < -100){
      this.enemy.posX = 1200;
    }

    //当たり判定
    const diffX = this.player.posX - this.enemy.posX;
    const diffY = this.player.posY - this.enemy.posY;
    if(Math.sqrt(diffX*diffX + diffY*diffY) <= this.player.size + this.enemy.size){
      this.stop();
    }
  }

  /**
   * 描画
   */
  draw(){
    this.player.draw(this.ctx);
    this.enemy.draw(this.ctx);

    this.ctx.drawImage(
      this.enemy.image,
      this.enemy.posX - this.enemy.image.width/2,
      this.enemy.posY - this.enemy.image.height/2
    );

    //線
    this.ctx.beginPath();
    this.ctx.moveTo(0,this.player.initPosY + this.player.image.height/2);
    this.ctx.lineTo(this.canvas.width,this.player.initPosY + this.player.image.height/2)
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    //スコア
    this.ctx.font = "20pt Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`SCORE: ${Math.round(this.score)}`,600,50);
  }

  key(event){
    if(event.code === "Space"){
      if(this.player.posY !== this.player.initPosY) return;
      
      this.player.speedY = -25;
      this.player.accY = 1.2;
    }
  }
}

class Character{
  constructor(img,posX,posY,size){
    this.image = new Image();
    this.image.src = img;

    this.posX = posX;
    this.posY = posY;
    this.initPosX = posX;
    this.initPosY = posY;

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

const game = new Game();
game.start();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});