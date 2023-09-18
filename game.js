/**
 * Game Class
 */
class Game{
  /**
   * 初期化   
   */
  constructor(){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.enemys = [];
    this.nextEnemy = 50;
    this.count = 0;

    this.score = 0;
    localStorage.score = 0;

    this.isStart = false;
    this.isGameOver = false;

    this.debug = false;

    this.ctx.font = "50pt Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("キーを押してスタート...",120,300);

    this.ctx.font = "15pt Arial";
    this.ctx.fillText("操作方法",370,400);
    this.ctx.font = "10pt Arial";
    this.ctx.fillText("ジャンプ: スペース",360,418);
    this.ctx.fillText("小ジャンプ: 左シフト",360,433);
    this.ctx.fillText("当たり判定表示: D",360,448);
    this.ctx.fillText("フルスクリーン: F",360,463);

    this.ctx.font = "20pt Arial";
    this.ctx.fillText("©︎2023 TAKA",350,590);
  }

  /**
   * ゲームのスタート
   */
  start(){
    this.player = new Character("./img/avatar.png",150,400,60);

    this.grounds = [
      new Block("./img/ground.png",0,464),
      new Block("./img/ground.png",256,464),
      new Block("./img/ground.png",512,464),
      new Block("./img/ground.png",768,464),
      new Block("./img/ground.png",1024,464)
    ];

    this.back = new Block("./img/back.png",0,0)

    this.loop = setInterval(()=>{
      this.update();

      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

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

    this.ctx.font = "80pt Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("GAME OVER",120,300);

    this.ctx.font = "30pt Arial";
    this.ctx.fillText("キーを押してスタート...",250,350);

    if(localStorage.score < this.score){
      localStorage.score = Math.floor(this.score);
    }
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

    this.enemys = this.enemys.filter(e=>e.posX > -100);

    if(this.count === this.nextEnemy){
      this.genEnemy();
      this.nextEnemy += Math.floor(80*Math.random()) + 50;
    }

    this.grounds.forEach(g=>{
      g.posX -= 4;
      if(g.posX <= -256){
        g.posX = 893;
      }
    });

    this.enemys.forEach(enemy=>{
      enemy.posX -= Math.floor(enemy.speedX);

      const diffX = this.player.posX - enemy.posX;
      const diffY = this.player.posY - enemy.posY;
      if(Math.sqrt(diffX*diffX + diffY*diffY) <= this.player.size + enemy.size){
        this.stop();
      }
    });
  }

  /**
   * 描画
   */
  draw(){
    if(this.isGameOver) return;

    this.back.draw(this.ctx);

    this.player.draw(this.ctx);

    this.enemys.forEach(e=>{
      e.draw(this.ctx);
    });
    
    this.grounds.forEach(g=>g.draw(this.ctx));

    //スコア
    this.ctx.font = "20pt Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`ハイスコア: ${localStorage.score}  スコア: ${Math.round(this.score)}`,500,50);

    if(this.debug){
      this.player.drawSize(this.ctx);
      this.enemys.forEach(e=>{
          e.drawSize(this.ctx);
      });  
    }
  }

  /**
   * 障害物の生成
   */
  genEnemy(){
    const enemy = this.random([
      new Character("./img/enemy1.png",1000,400 - (Math.random() > 0.75 ? 140 : 0),60),
      new Character("./img/enemy2.png",1000,425,40),
      new Character("./img/enemy3.png",1000,430 - (Math.random() > 0.85 ? 100 : 0),16),
      new Character("./img/enemy4.png",1000,430 - (Math.random() > 0.85 ? 80 : 0),16),
      new Character("./img/enemy5.png",1000,400,64),
      new Character("./img/enemy6.png",1000,410,25),
      new Character("./img/enemy7.png",1000,400,60),
      new Character("./img/enemy8.png",1000,430,35),
      new Character("./img/enemy9.png",1000,400,60),
      new Character("./img/enemy10.png",1000,410,25),
      new Character("./img/enemy11.png",1000,420,38)
    ]);

    enemy.speedX = 15*Math.random()+10;

    this.enemys.push(enemy);
  }

  /**
   * キー入力の制御
   * @param {KeyboardEvent} event キー入力イベント 
   */
  key(event){
    if(!this.isStart){
      this.isStart = true;
      this.start();
    }else if(this.isGameOver){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

      this.enemys = [];
      this.nextEnemy = 0;
      this.count = 0;
      this.score = 0;

      this.isGameOver = false;

      this.start();
    }else if(event.code === "Space"){
      if(this.player.posY !== 400) return;
      
      this.player.speedY = -30;
      this.player.accY = 1.5;
    }else if(event.code === "ShiftLeft"){
      if(this.player.posY !== 400) return;
      
      this.player.speedY = -20;
      this.player.accY = 1.5;
    }else if(event.code === "KeyD"){
      if(this.debug){
        this.debug = false;
      }else{
        this.debug = true;
      }
    }else if(event.code === "KeyF"){
      if(this.canvas.requestFullscreen){
        this.canvas.requestFullscreen(); 
      }else if(this.canvas.webkitRequestFullscreen){
        this.canvas.webkitRequestFullscreen();
      }else if(this.canvas.mozRequestFullScreen){
        this.canvas.mozRequestFullScreen();
      }else if(this.canvas.msRequestFullscreen){
        this.canvas.msRequestFullscreen(); 
      }
    }
  }

  /**
   * 配列からランダムに抽出
   * @param {Array} arr 元の配列  
   * @returns {any} 抽出された要素
   */
  random(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }
}

/**
 * Character Class
 */
class Character{
  /**
   * 初期化
   * @param {String} img 画像
   * @param {Number} posX 描画するX座標
   * @param {Number} posY 描画するY座標
   * @param {Number} size 当たり判定
   */
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

  /**
   * 描画
   * @param {CanvasRenderingContext2D} ctx Canvas
   */
  draw(ctx){
    ctx.drawImage(
      this.image,
      this.posX - this.image.width/2,
      this.posY - this.image.height/2
    );
  }

  /**
   * 当たり判定を描画
   * @param {CanvasRenderingContext2D} ctx Canvas
   */
  drawSize(ctx){
    ctx.beginPath();
    ctx.arc(this.posX,this.posY,this.size,0*Math.PI/180,360*Math.PI/180,false);
    ctx.strokeStyle = "red";
    ctx.lineWidth =1;
    ctx.stroke();
  }
}

/**
 * Block Class
 */
class Block{
  /**
   * 初期化
   * @param {String} img 画像
   * @param {Number} posX 描画するX座標
   * @param {Number} posY 描画するY座標
   */
  constructor(img,posX,posY){
    this.image = new Image();
    this.image.src = img;

    this.posX = posX;
    this.posY = posY;
  }

  /**
   * 描画
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx){
    ctx.drawImage(
      this.image,
      this.posX,
      this.posY
    );
  }
}

const game = new Game();

document.addEventListener("keydown",(event)=>{
  game.key(event);
});