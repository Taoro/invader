<?php include_once('header.php'); ?>

<div class="container">
	<h1>The Newton Game</h1>
	<div id="game_side">
		<canvas id="canvas" width="500" height="600"></canvas>
	</div>

	<div id="score_side">
        <p>Level <span id="level"></span></p>
        <p>Score <span id="score"></span></p>
        <br>
        <p>Apple missed <span id="missed"></span></p>
        <p>Apple destroyed <span id="destroyed"></span></p>
        <p>Shot fired <span id="fired"></span></p>
	</div>
</div>

<?php include_once('footer.php'); ?>