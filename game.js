class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.character = new Character("./img/avatar.png",80,300);

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
    this.character.posX += this.character.speedX;
    this.character.posY = this.character.speedY + this.acc;
    if(this.character.posY > 300){
      this.character.posY = 300;
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
  }

  key(event){
    if(event.code === "Space"){
      this.character.speedY = -20;
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