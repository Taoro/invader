	<script language="javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" type="text/javascript"></script>
	<script language="javascript" src="assets/js/jquery.hotkeys.js" type="text/javascript"></script>
	<script language="javascript" src="assets/js/key_status.js" type="text/javascript"></script>
	<script language="javascript" src="assets/js/loadash.js" type="text/javascript"></script>
    <?php

        $url = $_SERVER['PHP_SELF'];
        $reg = '#^(.+[\\\/])*([^\\\/]+)$#';
        if(preg_replace($reg, '$2', $url) == "game.php")
        echo '<script language="javascript" src="assets/js/game.js" type="text/javascript"></script>';
    ?>

</body>

</html>