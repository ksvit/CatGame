"use strict"
let ctx;
let catX = 0, catY = 0; 
let fishX = 25 + (randNum(1, 15)*50);
let fishY = 25 + (randNum(1, 15)*50);

let enemyX = 25 + (randNum(1, 15)*50);
let enemyY = 25 + (randNum(1, 15)*50);
let enemyArr = [[enemyX, enemyY]];

let score = 0;
let playContinue = true;
let wallX, wallY;

let blackHoleX, blackHoleY;
let holeDrawn = false;
let timerEnemy = setInterval(moveEnemy, 1000);

let starX = undefined;
let starY = undefined;
let starSpawnTimer = randNum(3, 25);
let starCaught = false;
let starPowerTimer = 10;

function setup(){
    let canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    addEventListener("keydown", moveCat);
    draw();
}
function reset(){
    catX = 0, catY = 0;
    fishX = 25 + (randNum(1, 15)*50);
    fishY = 25 + (randNum(1, 15)*50);
    
    enemyX =25 + (randNum(1, 15)*50);
    enemyY = 25 + (randNum(1, 15)*50);
    enemyArr = [[enemyX, enemyY]];
    
    blackHoleX = undefined;
    blackHoleY = undefined;
    holeDrawn = false;
    timerEnemy = setInterval(moveEnemy, 1000);
    
    score = 0;
    document.getElementById("score").innerHTML = score;
   
    starX = undefined;
    starY = undefined;
    starSpawnTimer = randNum(3, 25);
    starCaught = false;
    starPowerTimer = 10;
    
    playContinue = true;
    document.activeElement.blur();    
}
function draw(){
    ctx.clearRect(0, 0, 800, 800);
    
    drawGrid();
    drawWall();
    drawCat(catX, catY);

    //checks that the fish isn't in the house before drawing it
    while (!((fishY > 550 || fishY < 350) && (fishX > 750 || fishX < 650))){
        //get the fish outside to play
        fishX = 25 + (randNum(1, 15)*50);
        fishY = 25 + (randNum(1, 15)*50);;
    }
    drawFish(fishX, fishY);

    //draws all enemies
    for(let i = 0; i < enemyArr.length; i++){
        drawEnemy(enemyArr[i][0], enemyArr[i][1]);
    }

    if(starSpawnTimer === 0 && !starCaught){
        //make sure star won't spawn in the house
        while (!((starY > 550 || starY < 350) && (starX > 750 || starX < 650))){
            starX = 25 + (randNum(1, 15)*50);
            starY = 25 + (randNum(1, 15)*50);;
        }
        drawStar(starX, starY);
    }
    if (holeDrawn){
        drawBlackHole(blackHoleX, blackHoleY);
    }
    if(!playContinue && score < 100){
        ctx.font = "40px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("G A M E  O V E R", 250, 400);
    } 
    if (score >= 100){
        ctx.font = "40px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("W I N N E R ! ! !", 250, 400);
        playContinue = false;
    }
}
function addEnemy(){
    if(enemyArr.length < 10){
        enemyArr.push([enemyX, enemyY]);
    }
}
function moveEnemy(){
    let direction;
    for(let i = 0; i < enemyArr.length; i++){
        
        if(touchWall(enemyArr[i][0], enemyArr[i][1], catX, catY) <=40){ 
            playContinue = false;
            draw();
        }
        if(playContinue){
            direction = randNum(0, 3);
           
            if (direction == 0){
                if (enemyArr[i][1] > 725 || ((enemyArr[i][1] == 300) && (enemyArr[i][0] < 750 && enemyArr[i][0] >=650))){
                    enemyArr[i][1]+=0;
                } else {
                    enemyArr[i][1]+=50;
                }
            }
            if (direction == 1){
                if (enemyArr[i][1] < 50 || ((enemyArr[i][1] == 550) && (enemyArr[i][0]<750 && enemyArr[i][0] >=650))){
                    enemyArr[i][1]-=0;
                } else {
                    enemyArr[i][1]-=50;
                }
            }    
            if (direction == 2){
                if (enemyArr[i][0] < 50 ||((enemyArr[i][0] == 750) && (enemyArr[i][1] >= 350 && enemyArr[i][1] < 550))){
                    enemyArr[i][0]-=0;
                } else {
                    enemyArr[i][0]-=50;
                }
            }
            if (direction == 3){
                if(enemyArr[i][0] >=750 || ((enemyArr[i][0] == 600) && (enemyArr[i][1] >= 350 && enemyArr[i][1] < 550))){
                    enemyArr[i][0]+=0;
                } else {
                    enemyArr[i][0]+=50;
                }
            }
             //checks that the enemy got the fish, and updates the score accordingly
             if (touchWall(fishX, fishY, enemyArr[i][0], enemyArr[i][1]) <= 40){
                score-=10;
                document.getElementById("score").innerHTML = score;
            }
            if(touchWall(enemyArr[i][0], enemyArr[i][1], blackHoleX, blackHoleY) <=40){
                enemyArr.splice(enemyArr[i], 1);
                score+=30;
                document.getElementById("score").innerHTML = score;
                holeDrawn = false;
                blackHoleX = undefined;
                blackHoleY = undefined;
            }  
        }
       
    draw();
    }
    if (starSpawnTimer > 0){
        starSpawnTimer-=1;
    }
    if(starCaught && starPowerTimer > 0){
        starPowerTimer-=1;
    }
}
function moveCat(event){
    if(playContinue){
        if (event.key == "ArrowDown"){
            if(catY > 725 ||( (catY == 300) && (catX < 750 && catX >= 650))){ 
                catY+=0;
            } else {
                catY+=50;
            }
        } else if (event.key == "ArrowUp"){
            if(catY < 50 || ((catY == 550) && (catX<750 && catX >=650))){
                catY-=0;
            } else {
                catY-=50;
            }
        } else if (event.key == "ArrowLeft"){
            if(catX < 50 ||((catX == 750) && (catY >= 350 && catY < 550))){
                catX-=0;
            } else {
                catX-=50;
            }
        } else if(event.key == "ArrowRight"){
            if(catX>=750 || ((catX == 600) && (catY >= 350 && catY < 550))){
                catX+=0;
            } else {
                catX+=50;   
            } 
        } else if(event.key == " "){
            blackHoleX = catX;
            blackHoleY = catY;
            holeDrawn = true;
        }
    }

    //determines if cat touches the star, and resets star values so it's no longer on board
    if(touchWall(catX, catY, starX, starY)<=40){
        starCaught = true;
        starX = undefined;
        starY = undefined;
    }

    //determining distance between cat and fish; if too close, fish gets eaten 
    //i know the function is called touch wall but i made it later for the walls then put it here
    //...and now i'm not even using it to check distance from walls -__-
    if(touchWall(fishX, fishY, catX, catY)<=40){
        fishX = undefined; //makes the fish dissappear if the cat is close enough to eat it
      
        if(starCaught && starPowerTimer > 0){
            score+=20; //double points if the cat had the star
        } else {
            score+=10; //regular points if the cat doesn't have the star
        }
        document.getElementById("score").innerHTML = score;
              
        fishX = 25 + (randNum(1, 15)*50);
        fishY = 25 + (randNum(1, 15)*50);

        enemyX = 25 + (randNum(1, 15)*50);
        enemyY = 25 + (randNum(1, 15)*50);
        addEnemy(enemyX, enemyY);
    } 
    draw();
}

function randNum(min, max){
    let range = (max-min) + 1;
    let randNum = (Math.floor(Math.random()*range));
    return randNum;
}
function touchWall(x1, y1, x2, y2){
    //the purpose of this function is to determine the distance between (x1, y1) and (x2, y2)
    //this function was originally made to determine distance between characters ant the wall
    //but i quickly realized it could be used for much more.
    let X = Math.pow((x2 - x1), 2);
    let Y = Math.pow((y2 - y1), 2);
    let distance = Math.sqrt(X + Y);
   return distance;
}
function drawFish(x, y){

    
  

    ctx.fillStyle = "grey";
    ctx.save();
    ctx.translate(x, y);
    //draw tail
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(18, -12);
    ctx.lineTo(18, 12);
    ctx.lineTo(0, 0);
    ctx.fill();
    //draw body
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2*Math.PI);
    ctx.fill();
    //draw eye
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(-5, -4, 2, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
     
}
function drawCat(x, y){

    ctx.save();
    ctx.translate(x+25, y+25);
    ctx.fillStyle = "orange";
    //draw ears
    //left
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(-12.5, -20);
    ctx.lineTo(-15, 0);
    ctx.fill();
    //right
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(12.5, -20);
    ctx.lineTo(15, 0);
    ctx.fill();
    
    //draw head
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2*Math.PI);
    ctx.fill();
    
    //draw eyes
    //left
    ctx.beginPath();
    ctx.fillStyle="lightblue";
    ctx.arc(-6, -5, 2, 0, 2*Math.PI);
    ctx.fill();
    //right
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, 2*Math.PI);
    ctx.fill();
   
    //draw mouth
    //left
    ctx.beginPath();
    ctx.arc(-4, 4.5, 3.5, 0, Math.PI);
    ctx.stroke();
    //right
    ctx.beginPath();
    ctx.arc(4, 4.5, 3.5, 0, Math.PI);
    ctx.stroke();
   
    //draw nose
    ctx.beginPath();
    ctx.fillStyle= "pink";
    ctx.arc(0, 2, 3, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}
function drawEnemy(x, y){

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    //draw ears
    //left
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(-15, -18);
    ctx.lineTo(-15, 0);
    //ctx.lineTo();
    ctx.fill();
    //right
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(15, -18);
    ctx.lineTo(15, 0);
    ctx.fill();
  
    //draw head
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2*Math.PI);
    ctx.fill();
   
    //draw eyes
    //left
    ctx.beginPath();
    ctx.fillStyle="red";
    ctx.arc(-6, -5, 2, 0, 2*Math.PI);
    ctx.fill();
    //right
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, 2*Math.PI);
    ctx.fill();

    //angry eyebrows
    //left
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineTo(-9, -8);
    ctx.lineTo(-3, -5);
    ctx.stroke();
    //right
    ctx.beginPath();
    ctx.lineTo(9, -8);
    ctx.lineTo(3, -5);
    ctx.stroke();
    //mouth
    ctx.beginPath();
    ctx.arc(0, 10, 4, Math.PI, 2*Math.PI);
    ctx.stroke();
    //draw nose
    ctx.beginPath();
    ctx.fillStyle= "pink";
    ctx.arc(0, 2, 2.5, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}
function drawStar(x, y){
    
    //i actually had to do quite a bit of algebra to get this star to look as nice as it does  
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    ctx.lineTo(-18, -13.4);
    ctx.lineTo(-6, -13.4);
    ctx.lineTo(0, -26.8);
    ctx.lineTo(6, -13.4);
    ctx.lineTo(18, -13.4);
    ctx.lineTo(12, 0);
    ctx.lineTo(18, 13.4);
    ctx.lineTo(0, 6);
    ctx.lineTo(-18, 13.4);
    ctx.lineTo(-12, 0);

    ctx.fill();
    ctx.restore();
}
function drawBlackHole(x, y){
    ctx.save();
    ctx.translate(x+25, y+25);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
}
function drawCloud(x, y){
    ctx.fillStyle = "WhiteSmoke";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x-20, y+20, 20, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x+20, y+20, 20, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x-40, y+40, 20, Math.PI, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y+40, 20, Math.PI, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x+40, y+40, 20, Math.PI, 2*Math.PI);
    ctx.fill();
}
function drawGrid(){
    let x, y;
    //sky
    ctx.fillStyle = "lightBlue";
    ctx.beginPath();
    ctx.rect(0, 0, 800, 700);
    ctx.fill();

    //sun
    ctx.fillStyle = "goldenRod";
    ctx.beginPath();
    ctx.arc(800, 0, 100, 0, Math.PI);
    ctx.fill();
   
    //clouds
    drawCloud(200, 100);
    drawCloud(600, 175);
    drawCloud(300, 300);
    
    //island
    ctx.fillStyle = "BurlyWood";
    ctx.beginPath();
    ctx.arc(675, 700, 200, Math.PI, 2*Math.PI);
    ctx.fill();

    //house
    ctx.fillStyle = "teal";
    ctx.beginPath();
    ctx.rect(650, 450, 100, 100);
    ctx.fill();
    //roof
    ctx.fillStyle = "lightSalmon";
    ctx.beginPath();
    ctx.lineTo(750, 450);
    ctx.lineTo(700, 375);
    ctx.lineTo(650, 450);
    ctx.fill();
    //door
    ctx.fillStyle = "lightGrey";
    ctx.beginPath();
    ctx.arc(700, 550, 25, Math.PI, 2*Math.PI);
    ctx.fill();

    //below waves
    ctx.fillStyle = "aqua";
    ctx.beginPath();
    ctx.rect(0, 600, 800, 800);
    ctx.fill();
 
    //waves
    ctx.fillStyle = "lightBlue";
    ctx.strokeStyle = "white";
    
    x = 25, y = 600;
    for(let i = 0; i < 20; i++){
       if(x > 500){
            ctx.fillStyle = "BurlyWood";
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI);
            ctx.stroke();
            ctx.fill();
            x+=50;
       } else {
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI);
            ctx.stroke();
            ctx.fill();
            x+=50;
       }
   }
   //vert lines
    x = 0, y = 0; 
    ctx.strokeStyle = "white";
    for(let i = 0; i < 801; i+=50){
        ctx.beginPath();
        ctx.lineTo(x+50, y);
        ctx.lineTo(x+50, 800);
        ctx.stroke();
        x+=50;
    }
    //horizontal lines
    ctx.strokeStyle = "white";
    x = 0;
    y = 0;
    for(let i = 0; i < 801; i+=50){
        ctx.beginPath();
        ctx.lineTo(x, y+50);
        ctx.lineTo(800, y+50);
        ctx.stroke();
        y+=50;
    }

   
}
function drawWall(){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 15]);
    ctx.rect(650, 350, 100, 200);
    ctx.stroke();
    ctx.restore();
}