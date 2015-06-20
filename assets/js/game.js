// Constantes du jeu
var GAME_WIDTH = 500;
var GAME_HEIGHT = 600;
var GAME_ENEMY_NUMBER = 50;
var GAME_PIXEL_MOVE = 8;
var SHOT_LIMIT = 5;
var CONTEXT;
var SHOT_SIZE = {
    width:20,
    heigth:20
};

// Variables
var player = {
    posX : 0,
    posY : 0,
    sizeX: 37,
    sizeY : 50,
    level: 1,
    score : 1
};

var stats = {
    destroy: 0,
    missed: 0,
    shotFired: 0
};

var enemy = {
    id : 0,
    posX : 0,
    posY : 0,
    speed: 1,
    size : 40
};

var tabEnemies = [];
var shot = {
    posX : 0,
    posY : 0
};

var tabShot = [];
var imagePlayer;
var imageShot;
var imageEnemy;

var interval;
var isPaused;
var countImageLoad = 0;
var difficultyMultiplicator;

$(document).ready(function(){
    // get context

    if(initGame() == null) { return; }

    imagePlayer.onload = function() {
        countImageLoad++;
        loadImages();
    };
    imageShot.onload = function() {
        countImageLoad++;
        loadImages();
    };
    imageEnemy.onload = function() {
        countImageLoad++;
        loadImages();
    };
});

function loadImages() {
    if(countImageLoad == 3) {
        playGame();
    }
}

function initGame() {
    // On récupère l'objet canvas
    var elem = document.getElementById('canvas');
    if (!elem || !elem.getContext) { console.log("Canno't get canvas"); return null; }

    // On récupère le contexte 2D
    CONTEXT = elem.getContext('2d');
    if (!CONTEXT) { console.log("Canno't get context"); return null; }

    // Initialisations des variables
    GAME_WIDTH = elem.width;
    GAME_HEIGHT = elem.height;

    imagePlayer = new Image();
    imagePlayer.src = 'assets/img/player.png';
    imageShot = new Image();
    imageShot.src = 'assets/img/plume.png';
    imageEnemy = new Image();
    imageEnemy.src = 'assets/img/pomme.png';

    isPaused = false;
    return true;
}

function playGame() {
    loadGame();
    document.addEventListener("keydown", keyPressed, false);
    interval = setInterval(refreshGame, 10);
}

function loadGame() {
    player.posX = (GAME_WIDTH/2) - (player.sizeX/2);
    player.posY = (GAME_HEIGHT-(player.sizeY+10));

    tabEnemies = [];
    tabShot = [];
    player.score = 0;

    for(var i=1;i<GAME_ENEMY_NUMBER;i++) {
        enemy = {
            id : _.uniqueId(),
            posX : _.random(0, GAME_WIDTH-enemy.size),
            posY : _.random(0, -GAME_HEIGHT),
            speed: 1,
            size: 40
        };
        tabEnemies.push(enemy);
    }

    CONTEXT.drawImage(imagePlayer, player.posX, player.posY, player.sizeX, player.sizeY);
}

function refreshGame() {

    document.getElementById('score').innerHTML =  player.score.toString();
    document.getElementById('level').innerHTML =  player.level.toString();

    document.getElementById('destroyed').innerHTML =  stats.destroy.toString();
    document.getElementById('missed').innerHTML =  stats.missed.toString();
    document.getElementById('fired').innerHTML =  stats.shotFired.toString();

    clearScreen();

    //gestionScore();

    // Réaffichage de la barre
    CONTEXT.drawImage(imagePlayer, player.posX, player.posY, player.sizeX, player.sizeY);

    // Move shots & missiles
    if(tabShot.length > 0) {
        _.map(tabShot, moveShot);
    }

    // move enemies
    _.map(tabEnemies, moveEnemy);

}

function gestionScore() {

    difficultyMultiplicator = player.score - (50*player.level);
    if(difficultyMultiplicator > 0) {
        console.log("++ score");
        for(var i=1;i<(GAME_ENEMY_NUMBER / difficultyMultiplicator);i++) {
            enemy = {
                id : _.uniqueId(),
                posX : _.random(0, GAME_WIDTH-enemy.size),
                posY : _.random(0, -10000),
                speed: (this.speed + 1),
                size: 40
            };
            tabEnemies.push(enemy);
        }
        player.score = 0;
        player.level += 1;
    }

}

function moveShot(myShot, index) {
    if(myShot) {
        // shot move faster
        myShot.posY -= 10;

        if(myShot.posY <= 0) {
            _.pull(tabShot, myShot);
            player.score -= 10;
        }

        CONTEXT.drawImage(imageShot, myShot.posX, myShot.posY, SHOT_SIZE.width, SHOT_SIZE.heigth);
        //drawRectangle(myShot.posX, myShot.posY, SHOT_SIZE.width, SHOT_SIZE.heigth, "purple");
    }
}

function moveEnemy(myEnemy, indexEnemy) {

    myEnemy.posY += myEnemy.speed;

    if( myEnemy.posY >= GAME_HEIGHT )
    {
        myEnemy.posX = _.random(0, GAME_WIDTH-myEnemy.size);
        myEnemy.posY = _.random(0, -1000);
        player.score -= 1;
        stats.missed += 1;
    }

    // check collision with player
    if (myEnemy.posX < player.posX + player.sizeX && myEnemy.posX + myEnemy.size > player.posX &&
        myEnemy.posY < player.posY + player.sizeY && myEnemy.size + myEnemy.posY > player.posY) {
        endGame();
    }

    // check collision with bullet
    _.map(tabShot, function(myShot, index) {
        // check collision with shot
        if (myShot && myEnemy.posX < myShot.posX + SHOT_SIZE.width && myEnemy.posX + myEnemy.size > myShot.posX &&
            myEnemy.posY < myShot.posY + SHOT_SIZE.heigth && myEnemy.size + myEnemy.posY > myShot.posY) {

            myEnemy.posX = _.random(0, GAME_WIDTH-myEnemy.size);
            myEnemy.posY = _.random(0, -1000);

            player.score += 3;
            _.pull(tabShot, myShot);

            stats.destroy += 1;
        }
    });

    CONTEXT.drawImage(imageEnemy, myEnemy.posX, myEnemy.posY, myEnemy.size, myEnemy.size);
}

function keyPressed() {

    /*
     KEY_ENTER  = 13;
     KEY_ESC    = 27;
     KEY_SPACE  = 32;
     KEY_LEFT   = 37;
     KEY_UP     = 38;
     KEY_RIGHT  = 39;
     KEY_DOWN	= 40;
     */
    // RIGHT
    if (keydown.right) {
        if ( (player.posX+GAME_PIXEL_MOVE+player.sizeX) <= GAME_WIDTH )
        {
            player.posX += GAME_PIXEL_MOVE;
        }else {
            player.posX = 0;
        }
    }

    // LEFT
    if (keydown.left) {
        if ( (player.posX - GAME_PIXEL_MOVE) >= 0 )
        {
            player.posX -= GAME_PIXEL_MOVE;
        }else{
            player.posX = (GAME_WIDTH - player.sizeX);
        }

    }

    // UP
    if (keydown.up) {
        player.posY -= GAME_PIXEL_MOVE;
    }

    // DOWN
    if (keydown.down) {
        player.posY += GAME_PIXEL_MOVE;
    }

    if(keydown.space && tabShot.length < SHOT_LIMIT) {
        shot = {
            posX: player.posX + (player.sizeX/2),
            posY: player.posY - SHOT_SIZE.width
        };
        tabShot.push(shot);
        stats.shotFired += 1;
    }

    if(keydown.return) {
        pauseGame();
    }

}

function pauseGame() {
    if(isPaused) {
        interval = setInterval(refreshGame, 10);
        isPaused = false;
    }else {
        clearInterval(interval);
        isPaused = true;
    }
}

function endGame() {
    pauseGame();
}

function clearScreen() {
    CONTEXT.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}
