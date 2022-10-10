var Play=1;
var End=0;
var estadoJogo=Play;

var trex, trex_running, trex_collided;
var soloImage;
var pontos;
var nuvem, GrupoNuvens;
var obstaculos, GrupoObstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var fimImg, reinicio;
var somPulo, somMorte, somPoint;

function preload(){
trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
trex_collided=loadImage("trex_collided.png");
soloImage=loadImage("groundCor.png");
nuvemImage=loadImage("cloud.png");

obstaculo1=loadImage("obstacle1.png");
obstaculo2=loadImage("obstacle2.png");
obstaculo3=loadImage("obstacle3.png");
obstaculo4=loadImage("obstacle4.png");
obstaculo5=loadImage("obstacle5.png");

fimImg=loadImage("gameOver.png");
reinicio=loadImage("restart.png");

somPulo=loadSound("jump.mp3");
somMorte=loadSound("die.mp3");
somPoint=loadSound("checkPoint.mp3");
}
function setup(){
  createCanvas(windowWidth,windowHeight);

  var rand;
  console.log(rand);

  solo=createSprite(width/2,height-70,width,125);
  solo.addImage("solo",soloImage);
  solo.x=solo.width/2;
  
  trex=createSprite(50,height-50,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;
  trex.x=50;
  
  fim=createSprite(width/2,height/2 - 50);
  fim.addImage("fim", fimImg);
  fim.scale=0.8;

  restart=createSprite(width/2,height/2);
  restart.addImage(reinicio);
  restart.scale=0.8;

  solo_invisivel=createSprite(width/2,height-10,width,125);
  solo_invisivel.visible=false;

  pontos=0;

  GrupoObstaculos= new Group();
  GrupoNuvens= new Group();

  trex.setCollider("circle", 0, 0, 40);
  trex.debug=false;
}

function draw(){
  background("white")
  text("Pontuação:"+pontos,500,50);
  drawSprites();
  trex.collide(solo_invisivel);

  if(mousePressedOver(restart)){
    console.log("reiniciar o jogo");
    reset();
  }

  if(estadoJogo==Play){
    fim.visible=false;
    restart.visible=false;
    solo.velocityX= -(2 + 3*pontos/100);

    pontos=pontos+ Math.round(getFrameRate()/60);

  if(pontos>0 && pontos % 100==0){
    somPoint.play();
  }

  if(solo.x<width/2){
    solo.x=solo.width/2;
    }

  if((touches.length > 0 || keyDown("space")) && trex.y>height-120){
    trex.velocityY=-15;
    somPulo.play();
    touches=[];
  }

  if(keyDown("space") && trex.y>=515){
    trex.velocityY=-10;
    somPulo.play();
    }
    trex.velocityY=trex.velocityY+1;

    gerarNuvens();
    gerarObstaculos();

    if(GrupoObstaculos.isTouching(trex)){
      estadoJogo=End;
      somMorte.play();
      fim.visible=true;
      restart.visible=true;
    }
  }
  if(estadoJogo==End){
    solo.velocityX=0;

    GrupoNuvens.setVelocityXEach(0);
    GrupoObstaculos.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    GrupoNuvens.setLifetimeEach(-1);
    GrupoObstaculos.setLifetimeEach(-1);
    trex.velocityY=0;
  }
}

function gerarNuvens(){
 if(frameCount % 60==0){
   nuvem=createSprite(width+20,height-200,40,10);
   nuvem.velocityX=-3;
   nuvem.addImage(nuvemImage);
   nuvem.y=Math.round(random(10,60));
   nuvem.scale=0.4;
   nuvem.depth=trex.depth;

   trex.depth=trex.depth+1;

   nuvem.lifetime=width;
   GrupoNuvens.add(nuvem);
 }
}

function gerarObstaculos(){

 if(frameCount % 60==0){
  obstaculos=createSprite(width,height-80,10,40);
  obstaculos.velocityX= -(6 + pontos/100);

  var rand=Math.round(random(1,6));

  switch(rand){
    case 1:obstaculos.addImage(obstaculo1);
          break;
    case 2:obstaculos.addImage(obstaculo2);
          break;
    case 3:obstaculos.addImage(obstaculo3);
          break;
    case 4:obstaculos.addImage(obstaculo4);
          break;
    case 5:obstaculos.addImage(obstaculo5);
          break;
    case 6:obstaculos.addImage(obstaculo6);
          break;
  }
  obstaculos.scale=0.5;
  obstaculos.lifetime=300;
  GrupoObstaculos.add(obstaculos);
 }
}

function reset(){
  estadoJogo=Play;
  fim.visible=false;
  restart.visible=false;
  trex.changeAnimation("running", trex_running);
  GrupoObstaculos.destroyEach();
  GrupoNuvens.destroyEach();
  pontos=0;
}