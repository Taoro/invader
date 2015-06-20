//#region Variables & constantes

// Constantes du jeu
var GAME_WIDTH = 500;
var GAME_HEIGHT = 600;
var GAME_ENEMY_NUMBER = 20;
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
    size : 50,
    score : 0
};

var enemy = {
    id : 0,
    posX : 0,
    posY : 0,
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

//#endregion

$(document).ready(function(){
    // get context

    if(initGame() == null) { return; }

    imagePlayer.onload = function() {
        countImageLoad++;
        temp();
    };
    imageShot.onload = function() {
        countImageLoad++;
        temp();
    };
    imageEnemy.onload = function() {
        countImageLoad++;
        temp();
    };
});

function temp() {
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

    console.log(imageEnemy);

    isPaused = false;
    return true;
}

function playGame() {
    loadGame();
    document.addEventListener("keydown", keyPressed, false);
    interval = setInterval(refreshGame, 10);
}

function loadGame() {
    player.posX = (GAME_WIDTH/2) - (player.size/2);
    player.posY = (GAME_HEIGHT-player.size*2);

    tabEnemies = [];
    tabShot = [];
    player.score = 0;

    for(var i=1;i<GAME_ENEMY_NUMBER;i++) {
        enemy = {
            id : _.uniqueId(),
            posX : _.random(0, GAME_WIDTH-enemy.size),
            posY : _.random(0, -GAME_HEIGHT),
            size: 40
        };
        CONTEXT.drawImage(imageEnemy, enemy.posX, enemy.posY, enemy.size, enemy.size);
        tabEnemies.push(enemy);
    }

    CONTEXT.drawImage(imagePlayer, player.posX, player.posY, player.size, player.size);
}

function refreshGame() {

    document.getElementById('score').innerHTML =  player.score.toString();

    clearScreen();

    // Réaffichage de la barre
    CONTEXT.drawImage(imagePlayer, player.posX, player.posY, player.size, player.size);

    // Move shots & missiles
    if(tabShot.length > 0) {
        _.map(tabShot, moveShot);
    }

    // move enemies
    _.map(tabEnemies, moveEnemy);

    // TODO: Gestion niveau avec le score
    // TODO: Arrêter le jeu si score = 0. (instaurer defense?)
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
        //console.log(myShot);
    }
}

function moveEnemy(myEnemy, indexEnemy) {

    myEnemy.posY += 1;

    if( myEnemy.posY >= GAME_HEIGHT )
    {
        myEnemy.posX = _.random(0, GAME_WIDTH-myEnemy.size);
        myEnemy.posY = _.random(0, -1000);

        player.score -= 2;
    }

    // check collision with player
    if (myEnemy.posX < player.posX + player.size && myEnemy.posX + myEnemy.size > player.posX &&
        myEnemy.posY < player.posY + player.size && myEnemy.size + myEnemy.posY > player.posY) {
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
        }
    });

    CONTEXT.drawImage(imageEnemy, myEnemy.posX, myEnemy.posY, myEnemy.size, myEnemy.size);
    console.log(imageEnemy, myEnemy.posX, myEnemy.posY, myEnemy.size, myEnemy.size);
    //drawRectangle(myEnemy.posX, myEnemy.posY, myEnemy.size, myEnemy.size, "red");
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
        if ( (player.posX+GAME_PIXEL_MOVE+player.size) <= GAME_WIDTH )
        {
            player.posX += GAME_PIXEL_MOVE;
        }else {
            player.posX = 0;
        }
    }

    // LEFT
    if (keydown.left) {
        // console.log("player.posX: "+player.posX+" game width: "+GAME_PIXEL_MOVE);
        if ( (player.posX - GAME_PIXEL_MOVE) >= 0 )
        {
            player.posX -= GAME_PIXEL_MOVE;
        }else{
            player.posX = (GAME_WIDTH - player.size);
        }

    }

    // UP
    if (keydown.up) {
        //if ( ((barreX-PXL_DEPLA)) >= 0 )  barreX -= PXL_DEPLA;
        player.posY -= GAME_PIXEL_MOVE;
    }

    // DOWN
    if (keydown.down) {
        //if ( ((barreX-PXL_DEPLA)) >= 0 )  barreX -= PXL_DEPLA;
        player.posY += GAME_PIXEL_MOVE;
    }

    if(keydown.space && tabShot.length < SHOT_LIMIT) {
        shot = {
            posX: player.posX + (player.size/2),
            posY: player.posY - SHOT_SIZE.width
        };

        tabShot.push(shot);
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

function drawRectangle(x, y, w, h, c) {
    CONTEXT.fillStyle = c;
    CONTEXT.fillRect(x, y, w, h);
}

function clearScreen() {
    CONTEXT.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}
