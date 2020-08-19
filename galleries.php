<?
require_once 'settings.php';

$sql = 'select parent_title,
       title,
       descr,
       keywords,
       fileurl,
       text_class,
       gallery_type,
       another_gallery_type,
       gallery_type_id,
       another_gallery_type_id,
       has_images,
       has_galleries,
       videourl,
       parent_gallery_id,
       gallery_id,
       bg_class
from get_gallery_info(:gallery_id, :gallery_type)';
$sth = $datadb->prepare($sql);
$params = [
    'gallery_id' => (intval($_GET['g'])) ? intval($_GET['g']) : null,
    'gallery_type' => (intval($_GET['p'])) ? intval($_GET['p']) : null,
];
$sth->execute($params);
// Тут код для получения данных selectOne
if ($result = $sth->fetch(\PDO::FETCH_ASSOC)) {
    print_r($result);
    $sql_galleries = 'select gallery_id,
       title,
       pos,
       fileurl,
       text_class,
       bg_class
    from get_galleries(:gallery_id, :gallery_type_id)';
    $sto = $datadb->prepare($sql_galleries);
    $params_galleries = [
        'gallery_id' => $result['gallery_id'],
        'gallery_type_id' => $result['gallery_type_id'],
    ];
    $sto->execute($params_galleries);
    $result_galleries = $sto->fetchAll(\PDO::FETCH_ASSOC);
    print_r($result_galleries);
    $sql_photos = 'select 
        image_id,
        fileurl,
        descr
    from get_images(:gallery_id)';
    $str = $datadb->prepare($sql_photos);
    $params_photos = [
        'gallery_id' => $result['gallery_id'],
    ];
    $str->execute($params_photos);
    $result_photos = $str->fetchAll(\PDO::FETCH_ASSOC);
    print_r($result_photos);

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
        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body id="gallery" class='bg-light'>
    <nav class="navbar navbar-light navbar-expand-md navigation-clean bg-light shadow">
        <div class="container">
            <a class="navbar-brand" href="/"></a>
            <button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span
                        class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse pt-3 pt-md-0" id="navcol-1">
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item" role="presentation">
                        <a class="nav-link" href="/galleries/?p=<?= $result['another_gallery_type_id'] ?>">
                            <?= $result['another_gallery_type'] ?>
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="nav-link active" href="/galleries/?p=<?= $result['gallery_type_id'] ?>">
                            <?= $result['gallery_type'] ?>
                        </a>
                    </li>
                    <li class="nav-item" role="presentation"><a class="nav-link" href="/info">Info</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <header class="header position-relative" style="background-image: url(files/<?= $result['fileurl'] ?>)">
        <div class="container position-relative h-100">
            <div class="row position-absolute title-row">
                <h1 class="title w-100 text-center mx-3"><?= $result['title'] ?></h1>
                <h4 class="title w-100 text-center mx-3"><?= $result['descr'] ?></h4>
            </div>
        </div>
    </header>
    <? if ($result['gallery_type']): ?>
        <div class="container">
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb bg-light mt-4">
                        <li class="breadcrumb-item">
                            <a href="/galleries/?p=<?= $result['gallery_type_id'] ?>">
                                <?= $result['gallery_title'] ?>
                            </a>
                        </li>
                        <? if ($result['parent_gallery_id']): ?>
                            <li class="breadcrumb-item">
                                <a href="/galleries/?g=<?= $result['parent_gallery_id'] ?>">
                                    <?= $result['parent_title'] ?>
                                </a>
                            </li>
                        <? endif; ?>
                        <li class="breadcrumb-item active" aria-current="page">
                            <?= $result['gallery_title'] ?>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    <? endif; ?>

    <? if ($result['video_url']): ?>
        <section class="video mt-5">
            <div class="container">
                <div class="row">
                    <div class="col videoContainer">
                        <iframe class="video" src="<?= $result['video_url'] ?>" frameborder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </section>
    <? endif; ?>

    <? if ($result_galleries): ?>
        <section class="gallery mt-5">
            <div class="container">
                <div class="row">
                    <? foreach ($result_galleries as $gallery): ?>
                        <div class="col-12 col-lg-6 mb-5">
                            <a href="href="/galleries/?p=<?= $gallery['gallery_id'] ?>" class="card-link">
                            <div class="card position-relative"
                                 style="background-image: url(files/<?= $gallery['fileurl'] ?>) ">
                                <h2 class="position-absolute  <?= $gallery['text_class'] ?>"> <?= $gallery['title'] ?></h2>
                            </div>
                            </a>
                        </div>
                    <? endforeach; ?>

                </div>
            </div>
        </section>
    <? endif; ?>

    <? if ($result_photos): ?>
        <section class="gallery mt-5">
            <div class="container">
                <div class="row">
                    <? foreach ($result_photos as $photo): ?>
                        <div class="col-12 col-md-6 col-xl-4  mb-lg-4 mb-3">
                            <a class="fancybox" data-fancybox="group" href="files/<?= $photo['fileurl'] ?>">
                                <div class="photo position-relative"
                                     style="background-image: url(files/<?= $photo['fileurl'] ?>)">
                                </div>
                            </a>
                        </div>
                    <? endforeach; ?>
                </div>
            </div>
        </section>
    <? endif; ?>


    <footer class="py-2 text-center">© Jeisson Pulido, 2020</footer>
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    </body>

    </html>

<?php
}
unset($sth);
unset($sto);
unset($str);
?>