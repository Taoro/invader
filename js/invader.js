
var invader = {
	
	played: 0, level: 1, score: 0, boardSize: 700, population: 20, speed: 1500,
	expert: {1: 50, 2: 35, 3: 28, 4: 25, 5: 14},

	init : function(){
		
		invader.playable = true;
		invader.over = false;
		invader.board = new Array();
		invader.killed = new Array();
		invader.keyMap = new Array();
		invader.myInterval = 0;
		invader.starInterval = 0;
		invader.leftInterval = -1;
		invader.rightInterval = -1;
		invader.shotInterval = -1;
		invader.monsters = 0;
		invader.lines = 0;
		invader.shots = 0;
		invader.timer = 0;
		invader.shotRatio = 0;
		invader.killedRatio = 0;
		invader.expertise = parseFloat($('input[type=radio][name=gp]:checked').val());
		invader.megashot = parseFloat($('input[type=radio][name=megashot]:checked').val());
		invader.squareSize = invader.expert[invader.expertise];
		invader.nbSq = invader.boardSize/invader.squareSize;
		invader.maxLines = 50+invader.level*10;
		invader.shotRatioNeeded = 0.5+(invader.level/100);
		invader.killedRatioNeeded = 0.5+(invader.level/100);	
		invader.mySquare = { width: 50, height: 20, shotW: 5, shotH: 10 };
		invader.mySquare.left = (invader.boardSize/2)-(invader.mySquare.width/2)-(invader.squareSize/2)*(1-(invader.boardSize/invader.squareSize)%2);
		invader.mySquare.top = invader.boardSize-invader.mySquare.height-10;
		invader.mySquare.step = invader.squareSize;
		invader.popluation = invader.population-invader.level+1;
		$('#score').html("Score: "+invader.score);
		$('#played').html("Parties: "+invader.played);
		$('#lines').html("Lignes: "+invader.lines);
		$('#level').html("Niveau: "+invader.level);
		$('#monsters').html("Monstres créés: "+invader.monsters);
		$('#killed').html("Tués: "+invader.killed.length);
		$('#shots').html("Tirs: "+invader.shots);
		$('#board').css({ width: invader.boardSize+'px', height: invader.boardSize+'px' }).html('<div id="board_bg"></div>');
		$('#board_bg').css({ width: invader.boardSize+'px', height: invader.squareSize*invader.maxLines+'px', top: (-invader.squareSize*invader.maxLines+invader.boardSize) +'px' });
		$('#board').append("<div id='mySquare' style='left: " + invader.mySquare.left + "px; top: " + invader.mySquare.top + "px; width: " + invader.mySquare.width + "px; height: " + invader.mySquare.height + "px;'><div id='mySquareCl'></div><div id='mySquareCr'></div></div>");
		$("input[type=radio]").attr('disabled','disabled');
		$("input[type=button]").removeAttr('disabled');
		$('#pause_btn').css({display: 'block'});
		$('#resume_btn').css({display: 'none'});
		
		if(invader.played > 0){
			invader.gameRoutine();
		}
		else{
			invader.population = invader.nbSq;
			$('#game_object').append("<div id='info'><p>Bonjour! Prêt à zigouiller du monster?<br /><br />Les niveaux vous conviennent? ==><br /><br /><a id='restart' href='#'>Alors allons-y!</a></p></div>");
			$("input[type=radio]").removeAttr('disabled');
			$("input[type=button]").attr('disabled','disabled');
			$('#restart').click(function(){ invader.gameRestart(); });
		}
		invader.played++;
		invader.keyMapper();
		$('#abandon_btn').click(function(){ invader.gameOver() });
		$('#pause_btn').click(function() { invader.gamePause() }).css({display: 'block'});
		$('#resume_btn').click(function() { invader.gameResume() }).css({display: 'none'});
	},
	
	
	gameRoutine: function(){
		
		invader.addStars();
		invader.myInterval = setInterval(function() {

			if(invader.lines >= (invader.maxLines)) {
				invader.gameComplete();
			}
			else{
				invader.checkGameOver();
				invader.addSqareLine();
				invader.lines++;
			}

			invader.shotRatio = ((invader.killed.length/invader.shots).toPrecision(2))*100;
			invader.killedRatio = ((invader.killed.length/invader.monsters).toPrecision(2))*100;
			$('#played').html("Parties: "+invader.played);
			$('#lines').html("Lignes: "+invader.lines);
			$('#monsters').html("Monstres créés: "+invader.monsters);
			$('#shot_ratio').html("R/tirs: "+invader.shotRatio.toString().substr(0, 3)+"%");
			$('#killed_ratio').html("R/tués: "+invader.killedRatio.toString().substr(0, 3)+"%");
			
		}, invader.speed-(invader.level*50*invader.expertise));
		
		invader.starInterval = setInterval(function() { $('#board_bg').css({top: "+=1px"}); }, 120);
	},


	gameComplete: function(){
	
		clearInterval(invader.myInterval);
		clearInterval(invader.starInterval);
		invader.playable = false;
		invader.over = true;
		$("input[type=radio]").removeAttr('disabled');
		$("input[type=button]").attr('disabled','disabled');
		
		if(invader.shotRatio < invader.shotRatioNeeded){
			$('#game_object').append("<div id='info'><p>Votre ratio de monstres par tirs est trop bas!: "+invader.shotdRatio+"<br />Le niveau demande: "+invader.shotRatioNeeded+"<br /><a id='restart' href='#'>Recommencer</a></p></div>");
		}
		else if(invader.killedRatio < invader.killedRatioNeeded){
			$('#game_object').append("<div id='info'><p>Votre ratio de monstres tués en tout est trop bas!: "+invader.killedRatio+
			"<br />Le niveau demande: "+invader.killedRatioNeeded+"<br /><a id='restart' href='#'>Recommencer</a></p></div>");
		}
		else{
			invader.level++;
			invader.score += invader.killed.length;
			$('#score').html("Score: "+invader.score);
			$('#game_object').append("<div id='info'><p>Vous winnez finger in ze noze! <br />Ratio tués/balles: "+invader.shotRatio+" <br />Ratio tués/vivants: "+invader.killedRatio+"<br />Prêt pour le niveau suivant? <br /><a id='restart' href='#'>Allon-y!</a></p></div>");
		}
		$('#restart').click(function(){ invader.gameRestart(); });
	},


	gameOver: function(){
		if(invader.over == true) return false;
		
		clearInterval(invader.myInterval);
		clearInterval(invader.starInterval);
		$('#game_object').append("<div id='info'><p>GAME OVER<br /><br /><a id='restart' href='#'>Recommencer</a></p><br /><br />Changer le niveau ? ==>></div>");
		$("input[type=radio]").removeAttr('disabled');
		$("input[type=button]").attr('disabled','disabled');
		invader.score = 0;
		invader.over = true;
		invader.playable = false;
		$('#restart').click(function(){ invader.gameRestart(); });
	},
	
	
	gameRestart : function(){
		invader.init();
		$('#info').remove();
	},


	shotListener: function(){
		
		if(invader.keyMap[32] == false || invader.playable != true) return;
		if(invader.megashot == 1 && $('.shot').css("left") != undefined) return;
		
		//event.preventDefault();
		var gsl = invader.shots++;
		$('#shots').html("Tirs: "+(gsl+1));
		var myPos = parseFloat($('#mySquare').css("left"));
		shotPos = myPos + invader.mySquare.width/2 -2;
		var shotSquare = 0
		var shotTop = 0;
		
		$('.invaders').each(function(){
			
			var id = '#'+$(this).attr("id");
			var idAry = id.split("_");
			var column = idAry[1];
			var line = idAry[0].substr(2, idAry[0].length-2);
			var pos = column*invader.squareSize;
			var posDiff = shotPos-pos;
			
			if(posDiff >= 0 && posDiff <= invader.squareSize){
				shotSquare = { id: id, column: column, line: line };
				return false;
			}
		});
		
		if(shotSquare !== 0 && $.inArray(shotSquare.id, invader.killed) === -1)
		{
			shotTop = parseFloat($(shotSquare.id).css("top"));
			invader.killed.push(shotSquare.id);
			
			setTimeout(function(){
				$(shotSquare.id).remove();
				$('#board').append("<div class='fading' style='left: " + (shotSquare.column*invader.squareSize) + "px; top: " + shotTop + "px; width: "+invader.squareSize+"px; height: "+invader.squareSize+"px;'></div>");
				$('.fading').delay(50).fadeOut(70, function(){ $('.fading').remove() });
			}, (invader.mySquare.top-shotTop)/2);			
		}
				
		$('#board').append("<div class='shot' id='shot_"+gsl+"' style='left: " + shotPos + "px; top: " + invader.mySquare.top + "px; width: "+invader.mySquare.shotW+"px; height: "+invader.mySquare.shotH+"px;'></div>");
		$('#shot_'+gsl).animate({ top: shotTop }, (invader.mySquare.top-shotTop)/2, function(){ $('#shot_'+gsl).remove(); });
		$('#killed').html("Tués: "+invader.killed.length);
	},


	moveMySquareListener: function(dir){
		
		if(invader.playable != true) return;
			
		var myPos = parseFloat($('#mySquare').css("left"));
		var halfSquareSize = invader.squareSize/2;
		var halfMySquare = invader.mySquare.width/2;

		if(dir == 37){
			(myPos <= halfSquareSize)? 
				myPos = -halfMySquare+halfSquareSize : myPos = "-="+invader.mySquare.step+"px";
			$('#mySquare').css("left", myPos);
		}
		else if(dir == 39) {
			(myPos >= invader.boardSize-halfMySquare-halfSquareSize)? 
				myPos = invader.boardSize-halfMySquare-halfSquareSize : myPos = "+="+invader.mySquare.step+"px";				
			$('#mySquare').css("left", myPos);	
		}
	},


	addSqareLine: function() {

		var aSq = new Array();
		
		for(var i=0; i<invader.nbSq; i++) {
			aSq[i] = Math.floor(Math.random()*invader.population);
			if(aSq[i] === 1) invader.monsters++;
		}
		
		invader.board.push(aSq);	
		$('.invaders').remove();

		for(var i=0; i<invader.board.length; i++) {
			for(var j=0; j<invader.nbSq; j++) {

				if(invader.board[i][j] === 1 && $.inArray("#i"+ i +"_"+ j, invader.killed) === -1){
					$('#board').append("<div id='i"+ i +"_"+ j +"' class='invaders' style='left: " + (j*invader.squareSize) + "px; top: " + ((invader.board.length-i)*invader.squareSize-invader.squareSize) + "px; width: "+invader.squareSize+"px; height: "+invader.squareSize+"px;'></div>");
				}
			}
		}
	},


	addStars: function() {

		for (var i=0; i<invader.maxLines*4; i++) {
				$('#board_bg').append("<div class='star' style='background: #fff; left: " + Math.floor(Math.random()*invader.boardSize) + "px; top: " + Math.floor(Math.random()*(invader.squareSize*invader.maxLines)) + "px; width: 1px; height: 1px;'></div>");
		}
	},


	checkGameOver: function() {
	
		if(invader.over == true || (invader.board.length < invader.nbSq)) return;
			
		var finalLine = invader.board.length-invader.nbSq;
		
		for(var j=0; j<invader.board[finalLine].length; j++) {

			if(invader.board[finalLine][j] == 1 && $.inArray("#i"+ finalLine +"_"+j, invader.killed) === -1){
				
				invader.gameOver();
			}
		}
	},


	gamePause: function(){
	
		if(invader.playable == false) return false; 
		
		invader.playable = false;
		clearInterval(invader.myInterval);
		clearInterval(invader.starInterval);
		$('#pause_btn').css({display: 'none'});
		$('#resume_btn').css({display: 'block'});
	},


	gameResume: function(){
	
		if(invader.playable == true) return false; 
		
		invader.playable = true;
		invader.myInterval = setInterval(function() { invader.gameRoutine(); }, invader.speed-(invader.level*50*invader.expertise));
		invader.starInterval = setInterval(function() { $('#board_bg').css({top: "+=1px"}); }, 120);
		$('#pause_btn').css({display: 'block'});
		$('#resume_btn').css({display: 'none'});
	},
	
	
	keyMapper: function(){ 
		
		keys = [32, 37, 39];
		invader.keyMap[32] = false;
		invader.keyMap[37] = false;
		invader.keyMap[39] = false;
		invader.moveMySquareListener();

		$(document).keydown(function(event) {
			if($.inArray(event.keyCode, keys) === -1) return;
			
			if(invader.keyMap[event.keyCode] == false){
				invader.keyMap[event.keyCode] = +new Date();
			}
			
			if(invader.keyMap[32] != false && invader.shotInterval === -1){
				invader.shotListener();
				invader.shotInterval = setInterval(function() {
					if(invader.keyMap[32] != false){
						invader.shotListener();
					} else clearInterval(invader.shotInterval);
				}, 250);
			}
			if(invader.keyMap[37] != false && invader.leftInterval === -1){
				if(invader.rightInterval === -1){
					invader.moveMySquareListener(37);
					invader.leftInterval = setInterval(function() {
						if(invader.keyMap[37] != false){
							invader.moveMySquareListener(37);
						} else clearInterval(invader.leftInterval);
					}, 100);
				}
			}	
			else if(invader.keyMap[39] != false && invader.rightInterval === -1){
				if(invader.leftInterval === -1){
					invader.moveMySquareListener(39);
					invader.rightInterval = setInterval(function() {
						if(invader.keyMap[39] != false){
							invader.moveMySquareListener(39);
						} else clearInterval(invader.rightInterval);
					}, 100);
				}
			}			
		});
			
		$(document).keyup(function(event) {
			if($.inArray(event.keyCode, keys) === -1) return;
			
			if(invader.keyMap[event.keyCode] != false){
				invader.keyMap[event.keyCode] = false;
				
				if(event.keyCode == 32){
					clearInterval(invader.shotInterval);
					invader.shotInterval = -1;
				}
				if(event.keyCode == 37){
					clearInterval(invader.leftInterval);
					invader.leftInterval = -1;
				}
				if(event.keyCode == 39){
					clearInterval(invader.rightInterval);
					invader.rightInterval = -1;
				}
			}
		});
	}
};

$(document).ready(function(){ invader.init(); });

