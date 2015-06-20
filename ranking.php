<?php
    include_once('header.php');
$host = "127.0.0.1";
$database = "invader";
$user = "root";
$pass = "";

try {
    $dbh = new PDO('mysql:host='.$host.';dbname='.$database, $user, $pass, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    $request = $dbh->query('SELECT * FROM highscore ORDER BY dateplayed DESC LIMIT 20 ');
} catch (PDOException $e) {
    print "Erreur !: " . $e->getMessage() . "<br/>";
    die();
}
?>

<div class="container">
	<h1>The Newton Game</h1>
	<h2 class="center">Classement - 50 meilleurs scores</h2>

    <body>
    <div id="wrapper">
        <table id="highscore" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Destroyed</th>
                <th>Missed</th>
                <th>Fired</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            <?php

                //$request->setFetchMode(PDO::FETCH_OBJ);
                while ($donnees = $request->fetch(PDO::FETCH_ASSOC))
                {
                    echo '<tr>';
                        echo '<td>'. $donnees['playername'] .'</td>';
                        $scoreFinal = $donnees['playerscore'] * $donnees['playerlevel'];
                        echo '<td>'. $scoreFinal .'</td>';
                        echo '<td>'. $donnees['statsdestroyed'] .'</td>';
                        echo '<td>'. $donnees['statsmissed'] .'</td>';
                        echo '<td>'. $donnees['statsshotfired'] .'</td>';
                        echo '<td>'. $donnees['dateplayed'] .'</td>';
                    echo '</tr>';
                }

            ?>

            </tbody>
        </table>
    </div>

</div>

<?php
    $dbh = null;
    include_once('footer.php');
?>