const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width/BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score = 0;      // 紀錄分數
const buttonStart = document.getElementById("buttonStart")

snake = {
    //身體位置    
    body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],  
    //身體長度    
    size: 5, 
    //行進方向 
    direction: { x: 0, y: -1 }, 
    //畫蛇
    drawSnake: function () {
        this.moveSnake();
        ctx.fillStyle='lime';
        ctx.shadowColor = '#00ff88'; // 螢光綠光
        ctx.shadowBlur = 12; // 發光半徑
        for (let i=0; i<this.body.length; i++){      
        ctx.fillRect(
        this.body[i].x * BLOCK_SIZE,
        this.body[i].y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
        );
    }
    },
    //移動蛇
    moveSnake: function () {
        newBlock = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        }
        this.body.unshift(newBlock);
        while (this.body.length > this.size) {

            this.body.pop();
        }


    },
}
apple = {
    //蘋果位置
    x: 5,
    y: 5,
    //畫蘋果
    drawApple: function () {
        ctx.fillStyle = 'red';
        ctx.shadowColor = '#ff5555'; // 螢光紅光
        ctx.shadowBlur = 14;
        ctx.fillRect(
        this.x * BLOCK_SIZE ,
        this.y * BLOCK_SIZE ,
        BLOCK_SIZE ,
        BLOCK_SIZE
        );

    },
    //放蘋果
    putApple: function () {
        this.x = Math.floor(Math.random() * MAP_SIZE);
        this.y = Math.floor(Math.random() * MAP_SIZE);

    },
}
function gameStart() {
    gameInterval = setInterval(drawGame, 100);
}

function keyDown(event) {
    //up
    if (event.keyCode == 38 || event.keyCode == 87){
        if (snake.direction.y == 1) return;
            snake.direction.y = -1;
            snake.direction.x = 0;
    }
    //down
    else if (event.keyCode == 40 || event.keyCode == 83) {
        if (snake.direction.y == -1) return;
            snake.direction.y = 1;
            snake.direction.x = 0;
    }
    //left
    else if (event.keyCode == 37 || event.keyCode == 65) {
        if (snake.direction.x == 1) return;
            snake.direction.y = 0;
            snake.direction.x = -1;
    }
    //right
    else if (event.keyCode == 39 || event.keyCode == 68) {
        if (snake.direction.x == -1) return;
            snake.direction.y = 0;
            snake.direction.x = 1;
    }
}

function drawGame() {
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    eatApple(); 
    drawScore();
    checkDeath();    
}
function drawMap() {
    ctx.fillStyle = 'black' ;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function eatApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        apple.putApple();
        document.getElementById("scoreBoard").textContent = "Score: " + score;
            // ✅ 更新上方分數區塊
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.textContent = "Score: " + score;

        // ✅ 加上閃光動畫
        scoreBoard.classList.add("flash");
        setTimeout(() => {
            scoreBoard.classList.remove("flash");
        }, 400); // 0.4秒後移除效果
    }
}
 function drawScore() {
     ctx.fillStyle = "white";
     ctx.font = "10px Verdana";
     ctx.fillText("Score " + score, canvas.width - 50, 10);    
}
function checkDeath() {
    // hit walls
    if( (snake.body[0].x < 0) ||
        (snake.body[0].x >= MAP_SIZE)||
        (snake.body[0].y < 0) ||
        (snake.body[0].y >= MAP_SIZE)
    ){
        clearInterval(gameInterval);
    }
    // hit body
    for (var i=1; i<snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y) {
                clearInterval(gameInterval);
            }  
    }
}
function initGame() {
    // 重設蛇的位置、長度與方向
    snake.body = [{ x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) }];
    snake.size = 5;
    snake.direction = { x: 0, y: -1 };

    // 重設分數
    score = 0;

    // 放置新的蘋果
    apple.putApple();

    // 清除畫面
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 清除上一次的遊戲循環（避免重複加速）
    clearInterval(gameInterval);
}

/////
document.addEventListener("keydown", keyDown);
gameStart();
buttonStart.addEventListener("click", function(){
    initGame();
    gameStart();
})
