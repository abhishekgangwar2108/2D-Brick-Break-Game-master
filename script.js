const startGame=document.getElementById("Name");
const menu=document.getElementById("menu");
startGame.addEventListener("click",START);

function START()
{
    document.getElementById("sound").classList.add("on");  
    menu.style.display="none";
    document.getElementById("gameOver").style.display="none";
    document.getElementById("youwon").style.display="none";
    document.getElementById("gameOver").style.display="none";
    document.getElementById("youlose").style.display="none";

    

    const cvs=document.getElementById("canvas");
    const ctx=cvs.getContext("2d");
    cvs.style.border="2px solid black";

    ctx.lineWidth="3";

    //BG Image
    

    const paddle_width=100;
    const paddle_margin_bottom=100;
    const paddle_height=20;
    const ball_radius=8;
    const SCORE_UNIT=10;
    const Max_level=3;

    let SCORE=0;
    let LIFE=3;
    let level=1;
    let left=false;
    let right=false;
    let gameOver=false;

    //Paddle

    const paddle={
      x:cvs.width/2-paddle_width/2,
      y:cvs.height-paddle_margin_bottom-paddle_height,
      width:paddle_width,
      height:paddle_height,
      dx:5
    };

    //Drawing Paddle

    function drawPaddle()
    {
      ctx.fillStyle="#2e3548";
      ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);

      ctx.strokeStyle="#ffcd05";
      ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
    }


    //Controlling Paddle
    document.addEventListener("keydown",function(event){
      if(event.key==="ArrowLeft"){
        left=true;
      }
      else if(event.key==="ArrowRight"){
        right=true;
      }
    });

    document.addEventListener("keyup",function(event){
      if(event.key==="ArrowLeft"){
        left=false;
      }
      else if(event.key==="ArrowRight"){
        right=false;
      }
    });

    //Move Paddle
    function movePaddle()
    {
      if(right && paddle.x+paddle.dx<cvs.width-100)
        paddle.x+=paddle.dx;
      else if(left && paddle.x-paddle.dx>0)
          paddle.x-=paddle.dx;
    }

    //Ball
    const ball={
      x:cvs.width/2,
      y:paddle.y-ball_radius,
      r:ball_radius,
      speed:4,
      dx:3*(Math.random()*2-1),
      dy:-3
    };

    //Drawing Ball

    function drawball()
    {
      ctx.beginPath();
      ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
      ctx.fillStyle="#ffcd05";
      ctx.fill();
      ctx.strokeStyle="#2e3548";
      ctx.stroke();
      ctx.closePath();
    }

    function moveBall()
    {
      ball.x+=ball.dx;
      ball.y+=ball.dy;
    }

    //Function Reset Ball

    function resetBall()
    {
      ball.x=cvs.width/2;
      ball.y=paddle.y-ball_radius;
      ball.dx=3*(Math.random()*2-1);
      ball.dy=-3;
    }

    //Bricks
    const brick={
      row:1,
      column:10,
      width:55,
      height:20,
      offsetleft:23,
      offsetTop:20,
      marginTop:60,
      fillColor: "orange",
      strokeColor: "#FFF"
    };
    let bricks=[];
    //Creating Bricks
    function createBrick()
    {
      for(let r=0;r<brick.row;r++)
      {
        bricks[r]=[];
        for(let c=0;c<brick.column;c++)
        {
          bricks[r][c]={
            x:c*(brick.width+brick.offsetleft)+brick.offsetleft,
            y:r*(brick.height+brick.offsetTop)+brick.offsetTop+brick.marginTop,
            status: true
          };
        }
      }
    }
    createBrick();
    //Drawing Bricks on Canvas
    function drawBrick()
    {
      for(let r=0;r<brick.row;r++)
      {
        for(let c=0;c<brick.column;c++)
        {
          if(bricks[r][c].status)
          {
            ctx.fillStyle=brick.fillColor;
            ctx.fillRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height);
            ctx.strokeStyle=brick.strokeColor;
            ctx.strokeRect(bricks[r][c].x,bricks[r][c].y,brick.width,brick.height);
          }
        }
      }    
    }

    //Ball Collision with Bricks

    function ballBrickCollision()
    {
      for(let r=0;r<brick.row;r++)
      {
        for(let c=0;c<brick.column;c++)
        {
          let b=bricks[r][c];
          if(b.status)
          {
            if(ball.x+ball.r>b.x && ball.x-ball.r<b.x+brick.width && ball.y+ball.r>b.y && ball.y-ball.r<b.y+brick.height)
            {
              b.status=false;
              BrickSound.play();
              ball.dy=-ball.dy;
              SCORE+=SCORE_UNIT;
            }
          }
        }
      }   
    }

    //Details of Life Score Etc.

    function stats(text,textX,textY,img,imgX,imgY)
    {
      ctx.fillStyle="#FFF";
      ctx.font="25px Germania One";
      ctx.fillText(text,textX,textY);
      ctx.drawImage(img,imgX,imgY,width=25,height=25);
    }

    //draw paddle ball and bricks
    function draw()
    {
      drawPaddle();

      drawball();

      drawBrick();

      stats(SCORE,35,25,Score_Img,5,5);
      stats(LIFE,cvs.width-25,25,Life_Img,cvs.width-55,5);
      stats(level,cvs.width/2,25,Level_Img,cvs.width/2-30,5);

    }

    function collision()
    {
      if(ball.x+ball.r>cvs.width || ball.x-ball.r<0)
        ball.dx=-ball.dx;
      if(ball.y+ball.r<10)
          ball.dy=-ball.dy;
      if(ball.y+ball.r>cvs.height)
      {
        LifeSound.play();
        LIFE--;
        resetBall();
      }  
    }

    //Ball Collision with Paddle

    function PaddleCollision()
    {
      if(ball.x<paddle.x+paddle.width && ball.x>paddle.x && paddle.y<paddle.y+paddle.height && ball.y>paddle.y)
      {

        let collidePoint=ball.x-(paddle.x+paddle.width/2);
        collidePoint=collidePoint/(paddle_width/2);
        let angle=collidePoint*Math.PI/3;


        ball.dx=ball.speed*Math.sin(angle);
        ball.dy=-ball.speed*Math.cos(angle);
      }
    }

    //Checking GameIs Over or Not
    function Game_over()
    {
      if(LIFE<0){
        showLose();
        LossSound.play();
        gameOver=true;

      }
    }

    //Checking Level
    function levelUp()
    {
      let isLevelDone=true;
      for(let r=0;r<brick.row;r++){
        for(let c=0;c<brick.column;c++){
          isLevelDone=isLevelDone && !bricks[r][c].status;
        } 
      }
      if(isLevelDone){
        if(level>=Max_level){
          showWin();
          winSound.play();
          gameOver=true;
        }
        levelIn.play();
        brick.row++;
        createBrick();
        ball.speed+=0.3;
        resetBall();
        level++;
      }
    }

    function update(){
      movePaddle();
      moveBall();
      collision();
      PaddleCollision();
      ballBrickCollision();
      Game_over();
      levelUp();
    }

    //BG IMAGE

    function loop(){
      let BG_IMG=new Image();
      BG_IMG.src=("level"+level+".jpg");
      ctx.drawImage(BG_IMG,0,0,800,600);
      draw();
      update();
      if(!gameOver)
        requestAnimationFrame(loop);
    }
    loop();

    
    document.getElementById("sound").addEventListener("click",audioManage);

    function audioManage(){
      let imgSrc=document.getElementById("sound").getAttribute("src");
      let sound_Img= ((imgSrc=="sound.png")? "mute.png" : "sound.png");
      document.getElementById("sound").setAttribute("src",sound_Img);

      //Muting the Sounds On clicking it

      winSound.muted=winSound.muted? false : true;
      LossSound.muted=LossSound.muted? false : true;
      BrickSound.muted=BrickSound.muted? false : true;
      LifeSound.muted=LifeSound.muted? false : true;
      levelIn.muted=levelIn.muted? false : true;
    }

    document.getElementById("restart").addEventListener("click",restart);

    function restart(){
      START();
    }

    function showWin()
    {
      document.getElementById("gameOver").style.display="block";
      document.getElementById("youwon").style.display="block";
    }

    function showLose()
    {
      document.getElementById("gameOver").style.display="block";
      document.getElementById("youlose").style.display="block";
    }

    const returnToMenu=document.getElementById("Main_Menu");
    returnToMenu.addEventListener("click",()=>{
      location.reload();
    });
}


//Handling The Show Rules Option In the Main Menu;

document.getElementById("show").addEventListener("click",function(){
  document.getElementById("rules").style.display="block"; 
});

//Handling The Credit Option In the Main Menu;
document.getElementById("contacts").addEventListener("click",function(){
  document.getElementById("credit").style.display="block"; 
});

document.getElementById("close-btn").addEventListener("click",()=>{
  document.getElementById("rules").style.display="none";
});

document.getElementById("close").addEventListener("click",()=>{
  document.getElementById("credit").style.display="none";
});
