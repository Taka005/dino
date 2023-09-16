class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getthis.ctx("2d");
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.character = new Character("./img/avatar.png",150,350);

    this.loop = setInterval(()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.update();
      this.draw();
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

    this.ctx.beginPath();
    this.ctx.moveTo(0,this.character.initPosY);
    this.ctx.lineTo(this.canvas.width,this.character.initPosY)
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }

  key(event){
    if(event.code === "Space"){
      if(this.character.posY !== this.character.initPosY) return;
      
      this.character.speedY = -25;
      this.character.accY = 1.5;
    }
  }
}

class Character{
  constructor(img,posX,posY){
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
  }
}

const game = new Game();
game.start();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});