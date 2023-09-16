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
    this.character = new Character("./img/avatar.png",150,400,32);
    this.enemy = new Character("./img/enemy.png",1200,400,32);

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
    this.character.speedY += this.character.accY;
    this.character.posY += this.character.speedY;

    if(this.character.posY > this.character.initPosY){
      this.character.posY = this.character.initPosY;
      this.character.speedY = 0;
      this.character.accY = 0;
    }

    this.enemy.speedX = 15;
    this.enemy.posX -= this.enemy.speedX;
    if(this.enemy.posX < -100){
      this.enemy.posX = 1200;
    }

    //当たり判定
    console.log((this.character.posX - this.enemy.posX)^2 + (this.character.posY - this.enemy.posY)^2)
    if(Math.sqrt((this.character.posX - this.enemy.posX)^2 + (this.character.posY - this.enemy.posY)^2) <= this.character.size + this.enemy.size){
      this.stop();
    }
  }

  /**
   * 描画
   */
  draw(){
    this.ctx.drawImage(
      this.character.image,
      this.character.posX - this.character.image.width/2,
      this.character.posY - this.character.image.height/2
    );

    this.ctx.drawImage(
      this.enemy.image,
      this.enemy.posX - this.enemy.image.width/2,
      this.enemy.posY - this.enemy.image.height/2
    );

    //線
    this.ctx.beginPath();
    this.ctx.moveTo(0,this.character.initPosY + this.character.image.height/2);
    this.ctx.lineTo(this.canvas.width,this.character.initPosY + this.character.image.height/2)
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
      if(this.character.posY !== this.character.initPosY) return;
      
      this.character.speedY = -25;
      this.character.accY = 1.2;
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
}

const game = new Game();
game.start();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});