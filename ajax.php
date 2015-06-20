<?php
/**
 * Created by PhpStorm.
 * User: Bart
 * Date: 20/06/2015
 * Time: 11:58
 */

$host = "127.0.0.1";
$database = "invader";
$user = "root";
$pass = "";

try {
    $dbh = new PDO('mysql:host='.$host.';dbname='.$database, $user, $pass, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

    if( isset( $_POST ) ) {
        $req = $dbh->prepare("INSERT INTO highscore (playername, playerscore, playerlevel, statsdestroyed, statsmissed, statsshotfired, dateplayed)
                              VALUES (:playername, :playerscore, :playerlevel, :statsdestroyed, :statsmissed, :statsshotfired, :dateplayed)");
        $req->bindParam(':playername', $_POST['playername']);
        $req->bindParam(':playerscore', $_POST['playerscore']);
        $req->bindParam(':playerlevel', $_POST['playerlevel']);
        $req->bindParam(':statsdestroyed', $_POST['statsdestroyed']);
        $req->bindParam(':statsmissed', $_POST['statsmissed']);
        $req->bindParam(':statsshotfired', $_POST['statsshotfired']);
        $nowdate = new \DateTime('now');
        $req->bindParam(':dateplayed', $date, PDO::PARAM_STR);
        $req->execute();
    }

    $dbh = null;
} catch (PDOException $e) {
    header("location: index.php");
}

header("location: ranking.php");