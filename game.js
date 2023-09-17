class Game{
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.enemys = [];
    this.nextEnemy = 300;

    this.count = 0;
    this.score = 0;
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.player = new Character("./img/avatar.png",150,400,64);

    this.loop = setInterval(()=>{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.update();
      this.draw();

      this.score += 0.2;
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
    this.count++;

    this.player.speedY += this.player.accY;
    this.player.posY += this.player.speedY;

    if(this.player.posY > this.player.initPosY){
      this.player.posY = this.player.initPosY;
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
      this.nextEnemy += Math.floor(this.count+150*Math,random()); 
    }
  }

  /**
   * 描画
   */
  draw(){
    this.player.draw(this.ctx);
    this.enemy.draw(this.ctx);

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

  genEnemy(){
    const image = random([
      "./img/enemy.png",
      "./img/enemy1.png"
    ]);

    const enemy = new Character(image,1200,400 - Math.random() > 0.5? 40: 0,64);

    enemy.speedX = 15 * Math.random();

    this.enemys.push(enemy);
  }

  key(event){
    if(event.code === "Space"){
      if(this.player.posY !== this.player.initPosY) return;
      
      this.player.speedY = -25;
      this.player.accY = 1.5;
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

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

const game = new Game();
game.start();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});