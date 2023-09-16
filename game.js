class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.character = new Character("./avatar",30,250);

    this.loop = setInterval(()=>{
      this.ctx.clearRect(0,0,canvas.width,canvas.height);
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
    this.character.posX += 5;
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
}

class Character{
  constructor(img,posX,posY){
    this.image = new Image();
    this.image.src = img;

    this.posX = posX;
    this.posY = posY;
  }
}

const game = new Game();
game.start();