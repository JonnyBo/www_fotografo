<?
require_once 'settings.php';

$sql = 'select title,
       keywords,
       descr,
       arte_fileurl,
       arte_title,
       arte_bg_class,
       arte_text_class,
       arte_btn_class,
       trabajo_fileurl,
       trabajo_title,
       trabajo_bg_class,
       trabajo_text_class,
       trabajo_btn_class
from get_start_page';
$sth = $datadb->query($sql);
//$sth->execute();
if ($result = $sth->fetch(\PDO::FETCH_ASSOC)) {
//$result = []; // Тут код для получения данных selectOne
    ?>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <title>
            <?= $result['title'] ?>
        </title>
        <meta name="keywords" content="<?= $result['keywords'] ?>">
        <meta name="description" content="<?= $result['descr'] ?>">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/styles.css?v=2">

    </head>

    <body id='start-page'>
    <div class="container-fluid d-flex flex-column flex-lg-row h-100 p-0">
        <div class="left-part position-relative <?= $result['arte_bg_class'] ?>"
             style="background-image: url(files/<?= $result['arte_fileurl'] ?>)">
            <h1 class="title position-absolute <?= $result['arte_text_class'] ?>">Jeisson Pulido</h1>
            <a class="btn position-absolute <?= $result['arte_btn_class'] ?>" href="gallery/?p=1" role="button">
                <?= $result['arte_title'] ?>
            </a>
        </div>
        <div class="right-part <?= $result['trabajo_bg_class'] ?> position-relative"
             style="background-image: url(files/<?= $result['trabajo_fileurl'] ?>)">
            <h1 class="title position-absolute <?= $result['trabajo_text_class'] ?>">Fotografo</h1>
            <a class="btn position-absolute <?= $result['arte_btn_class'] ?>" href="gallery/?p=2" role="button">
                <?= $result['trabajo_title'] ?>
            </a>
        </div>
    </div>


    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script>
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);

    </script>
    </body>

    </html>
<?php
}
unset($sth);
?>