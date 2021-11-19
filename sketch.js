const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var player, playerBase, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var board1, board2;

function preload() {
  backgroundImg = loadImage("background.png");
  baseimage = loadImage("base.png");
  playerimage = loadImage("player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}


function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);
  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();
      collisionWithBoard1(i)
      collisionWithBoard2(i)
var board1Collision = Matter.SAT.collides(
  board1.body,
  playerArrows[i].body
);
var board2Collision = Matter.SAT.collides(
  board2.body,
  playerArrows[i].body
);
  
      
       var posX = playerArrows[i].body.position.x;
       var posY = playerArrows[i].body.position.y;

       if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
       }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

}
function collisionWithBoard1(index) {
  for (var i = 0; i < board1.length; i++) {
    if (playerArrows[index] !== undefined && board1[i] !== undefined) {
      var collision = Matter.SAT.collides(playerArrows[index].body, board1[i].body);

      if (collision.collided) {
          board1[i].remove(i);
        

        Matter.World.remove(world, playerArrows[index].body);
        delete playerArrows[index];
      }
    }
  }
}
function collisionWithBoard2(index) {
  for (var i = 0; i < board2.length; i++) {
    if (playerArrows[index] !== undefined && board2[i] !== undefined) {
      var collision = Matter.SAT.collides(playerArrows[index].body, board2[i].body);

      if (collision.collided) {
          board2[i].remove(i);
        

        Matter.World.remove(world, playerArrows[index].body);
        delete playerArrows[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
   if(numberOfArrows > 0){ 
     var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle;

    var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);
    numberOfArrows-=1;
  }  
  }
  }

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}


