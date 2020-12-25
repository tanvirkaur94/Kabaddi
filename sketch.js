var gameState = 0;
var rand;
var player1,player2,player1Img,player2Img;

var player1Pos, player2Pos;
var player1Score = 0;
var player2Score = 0;

function preload(){
    player1Img = loadAnimation("player1a.png","player1b.png","player1a.png");
    player2Img = loadAnimation("player2a.png","player2b.png","player2a.png");
}

function setup(){
    
    database = firebase.database();
    console.log("database"+ database);

    createCanvas(400,400);

    player1= createSprite(100,215,10,10);
  //  player1.shapeColor = "yellow";
    player1.addAnimation("player2Animation",player2Img);
    player1.scale=0.3;

    player2= createSprite(300,350,10,10);
  //  player2.shapeColor = "red";
    player2.addAnimation("player1Animation",player1Img);
    player2.scale= -0.3; // - symbol changes the direction of player
    
    

    //reference for position
    player1Pos = database.ref('player1/position');
    player1Pos.on("value", readPosition, showError);

    player2Pos = database.ref('player2/position');
    player2Pos.on("value", readPosition2, showError);

    //reference for score
    player1Score = database.ref('player1score/');
    player1Score.on("value", readPlayerScore1, showError);

    player2Score = database.ref('player2score/');
    player2Score.on("value", readPlayerScore2, showError);

    //reference for gamestate
    gameState = database.ref('gameState/');
    gameState.on("value", readGameState, showError)

}

function draw(){
background("grey");
drawline();
drawYellowline();
drawRedline();

if(gameState===0){

    fill("black");
    textSize(15);
    text("Press space to toss",100,150);

    if(keyDown("space")){

        rand = Math.round(random(1,2));
        console.log("playerNo." + rand)
        if(rand ===1){
            database.ref('/').update({
                'gameState':1
            })
            alert("YELLOW's turn")
        }
        if(rand ===2){
            database.ref('/').update({
                'gameState':2
            })
            alert("RED's turn")
        }

        database.ref('player1/position').update({
            x:120,
            y:300
        })

        database.ref('player2/position').update({
            x:330,
            y:300
        })

    
 
if(gameState===1){
    if(keyDown(LEFT_ARROW)){
        writePosition(-2,0);
      }
      else if(keyDown(RIGHT_ARROW)){
        writePosition(2,0);
      }
      else if(keyDown(UP_ARROW)){
        writePosition(0,-2);
      }
      else if(keyDown(DOWN_ARROW)){
        writePosition(0,2);
      }
      else if(keyDown("w")){
        writePosition2(0,-2);
      }
      else if(keyDown("s")){
        writePosition2(0,2);
      }
     
      if(player1.x>360){
          database.ref('/').update({
            'player1Score' : player1Score + 5,
            'player2Score' : player2Score - 5,
            'gameState': 0
          })
        
        alert("yellow won")
    }
    
    
}
    
    if(gameState===2){ 

        if(keyDown(UP_ARROW)){
            writePosition(0,-2);
          }
          else if(keyDown(DOWN_ARROW)){
            writePosition(0,2);
          }
          else if(keyDown("w")){
            writePosition2(0,-2);
          }
          else if(keyDown("s")){
            writePosition2(0,2);
          }
          else if(keyDown("a")){
            writePosition2(-2,0);
          }
          else if(keyDown("d")){
            writePosition2(2,0);
          }

        if(player2.x>55){
        database.ref('/').update({
            'player1score' : player1Score - 5,
            'player2score' : player2Score + 5,
            'gameState': 0
          })
            alert("red won")
        }
    }     

  }
}
text(player1Score,180,40);
text(player2Score,220,40);
console.log("gameState "+gameState);
drawSprites();

}
function writePosition(x,y){
    database.ref('player1/position').set({
      'x': position.x + x ,
      'y': position.y + y
    })
}

function writePosition2(x,y){ 
    database.ref('player2/position').set({
        'x': position2.x + x ,
        'y': position2.y + y
      })
  }
  
  function readPosition(data){
    position = data.val();
    //console.log(position.x);
    
    player1Pos.x = position.x;
    player1Pos.y = position.y;
  }

  function readPosition2(data){
    position2 = data.val();
   // console.log(position2.x);

    player2Pos.x = position2.x;
    player2Pos.y = position2.y;

  }
  
function readPlayerScore1(data){
    player1Score= data.val();
}

function readPlayerScore2(data){
    player2Score= data.val();
}

function readGameState(data){
    gameState = data.val();
}

  function showError(){
    console.log("Error in writing to the database");
  }

  function drawline(){
      for(var i = 0;i<400;i=i+20){
          line(200,i,200,i+10);
      }
  }

  function drawYellowline(){
    for(var i = 0;i<400;i=i+20){
        stroke("yellow");
        line(50,i,50,i+10);
    }
}

function drawRedline(){
    for(var i = 0;i<400;i=i+20){
        stroke("red");
        line(350,i,350,i+10);
    }
}
