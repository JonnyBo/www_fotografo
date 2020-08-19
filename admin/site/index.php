<?php
include_once "preview-data.php";
if ($_GET['lang']) {
    setcookie('lang', strip_tags($_GET['lang']), time()+3600*24*30, '/' );
}
$lang = trim(strip_tags($_GET['lang']))?trim(strip_tags($_GET['lang'])):'en';
if ($_COOKIE['lang']) {
    $lang = $_COOKIE['lang'];
}

//$lang = "es";
$content=$content[$lang];
?>
<!DOCTYPE html>
<html lang="<?=$lang?>">

<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-146173868-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-146173868-2');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link href="/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" media="none" onload="if(media!='all')media='all'">

    <link rel="stylesheet" href="/css/slick.css">
    <link rel="stylesheet" href="/css/slick-theme.css">
    <link rel="stylesheet" href="/css/myls.css?<?= time() ?>">
    <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest">
    <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <meta name="keywords" content="<?=$content["keywords"]?>">
    <meta name="descrption" content="<?=$content["description"]?>">
    <title><?=$content["title"]?></title>
    <meta name="og:title" content="<?=$content["title"]?>">
    <meta name="og:description" content="<?=$content["description"]?>">
    <meta name="og:url" content="https://myls.education">
    <meta name="og:site_name" content="Myls.school">
    <meta name="og:locale" content="en_En">
    <meta name="og:type" content="product">
</head>

<body>
<nav id="mainNav" class="navbar navbar-expand-lg fixed-top ">

    <a class="navbar-brand" href="#"><img src="/img/logo.svg" alt=""></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fa fa-bars"></i>
    </button>
    <div class="navbar-collapse collapse justify-content-end" id="navbarSupportedContent">
        <ul class="nav navbar-nav ml-auto">
            <? foreach ($content["mainMenu"] as $item): ?>
                <li class="nav-item"><a class="page-scroll nav-link js-scroll-trigger" href="#<?=$item["link"]?>"><?=$item["title"]?></a></li>
            <? endforeach; ?>

            <li class="nav-item"><a class="nav-link" href="/<? if ($lang == 'en'):?><?='?lang=es'?><? endif ?>"><? if ($lang == 'en'):?><?='ES'?><? else: ?><?='EN'?><? endif ?></a></li>
        </ul>
    </div>
</nav>
<header class="header">
    <div class="headerBlock col-lg-6 col-md-8 col-sm-8 col-12">
        <h1><?=$content["mainLine"]?></h1>
        <h3><?=$content["mainSubline"]?></h3>
    </div>
</header>
<section id="product">
    <div class="container border-bottom">
        <div class="row">
            <div class="col">
                <h3 class="title text-center"><?=$content["product"]["title"]?></h3></div>
        </div>

        <div class="row">
            <div class="col-md-8">

                <div class="text">
                    <ul>
                        <? foreach ($content["product"]["lines"] as $item): ?>
                            <li><?=$item?></li>
                        <? endforeach; ?>
                    </ul>
                </div>
            </div>
            <div class="col-md-4">
                <div class="img">
                    <img src="/img/Myls.school_web_product.png" alt="Myls.school web product">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h3 class="title text-center mt-5 light"><?=$content["product"]["firstSubtitle"]?></h3></div>
        </div>
        <div class="row">
            <div class="col">
                <h3 class="title text-center mt-5 mb-3"><?=$content["product"]["secondSubtitle"]?></h3></div>
        </div>

        <div class="row">
            <div class="col">
                <div class="btnBlock d-flex justify-content-center flex-wrap">
                    <button class="btn btn-primary btn-lg" type="button"><a href="/presentations/<?=$content["product"]["presentation_file"]?>" target="_blank"><?=$content["product"]["presentation"]?></a></button>
                    <button class="btn btn-primary btn-lg" type="button"><a href="/presentations/<?=$content["product"]["onePage_file"]?>" target="_blank"><?=$content["product"]["onePage"]?></a>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="features">
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h2 class="title text-center"><?=$content["features"]["title"]?></h2>
            </div>
        </div>
        <div class="row feature-block-container">
            <? foreach ($content["features"]["features"] as $item): ?>
                <div class="feature-block <?=$item["class"]?>">
                    <h4 class="feature-title"><?=$item["title"]?></h4>
                    <div class="feature-block-content d-flex justify-content-between">
                        <ul class="features-list <?=$item["linesClass"]?>">
                            <? foreach ($item["lines"] as $line): ?>
                            <li class="feature"><?=$line?></li>
                            <? endforeach; ?>
                        </ul>
                        <div class="feature-image"><img src="/img/<?=$item["img"]?>" alt="<?=$item["title"]?>"></div>
                    </div>
                </div>
            <? endforeach; ?>
        </div>
        <div class="row">
            <div class="col text-center"><?=$content["features"]["disclaimer"]?></div>
        </div>
        <div class="row">
            <div class="col">
                <div class="btnBlock d-flex justify-content-center flex-wrap">
                    <button class="btn btn-primary btn-lg" type="button"><a href="/presentations/Myls_school_whitepaper_ENG.pdf" target="_blank"><?=$content["features"]["whitepaper"]?></a></button>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="pricing">
    <div class="container border-top">
        <div class="row">
            <div class="col">
                <h2 class="title text-center"><?=$content["pricing"]["title"]?></h2>
            </div>
        </div>
        <div class="row">
            <div class="col price-container d-sm-block d-none">
                <div class="price-title row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&nbsp;</div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["basic"]?></div>
                    <div class="col-sm-3 col-8 bred"><?=$content["pricing"]["professional"]?></div>
                    <div class="col-sm-3 col-8 byellow"><?=$content["pricing"]["premium"]?></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 100 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen"><span class="price">30 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">50 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 300 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen"><span class="price">60 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">80 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 500 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                    <div class="col-sm-3 col-8 bred"><span class="price">100 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0 font-weight-bold d-flex align-items-center justify-content-center"><a href="#contact" class="js-scroll-trigger"><?=$content["pricing"]["customPrice"]?></a></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                    <div class="col-sm-3 col-8 bred"><span class="price">200 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000+ <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                    <div class="col-sm-3 col-8 bred font-weight-bold d-flex align-items-center justify-content-center"><a href="#contact" class="js-scroll-trigger"><?=$content["pricing"]["customPrice"]?></a></div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-discount row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"></div>
                    <div class="col-sm-3 col-8 bgreen">
                        <div><?=$content["pricing"]["discount6"]?></div>
                        <div><?=$content["pricing"]["discount12"]?></div>
                    </div>
                    <div class="col-sm-3 col-8 bred">
                        <div><?=$content["pricing"]["discount6"]?></div>
                        <div><?=$content["pricing"]["discount12"]?></div>
                    </div>
                    <div class="col-sm-3 col-8 byellow border-left-0 border-right-0"></div>
                </div>
                <div class="price-crm row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["crm"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["crm"]["basic"]?></div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-automation row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["automation"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["automation"]["basic"]?></div>
                    <div class="col-sm-3 col-8 bred"><?=$content["pricing"]["automation"]["professional"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-reports row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["reports"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["reports"]["basic"]?></div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-integration row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["integration"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center"></div>
                    <div class="col-sm-3 col-8 bred "><?=$content["pricing"]["integration"]["professional"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-support row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["support"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen price-yes d-flex align-items-center justify-content-center">v</div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                    <div class="col-sm-3 col-8 byellow d-flex align-items-center justify-content-center"><?=$content["pricing"]["support"]["premium"]?></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col price-container d-sm-none d-block mb-4">
                <div class="price-title row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&nbsp;</div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["basic"]?></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 100 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen"><span class="price">30 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 300 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen"><span class="price">60 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 500 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000+ <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center">x</div>
                </div>
                <div class="price-discount row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"></div>
                    <div class="col-sm-3 col-8 bgreen">
                        <div><?=$content["pricing"]["discount6"]?></div>
                        <div><?=$content["pricing"]["discount12"]?></div>
                    </div>
                </div>
                <div class="price-crm row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["crm"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["crm"]["basic"]?></div>
                </div>
                <div class="price-automation row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["automation"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["automation"]["basic"]?></div>
                </div>
                <div class="price-reports row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["reports"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen"><?=$content["pricing"]["reports"]["basic"]?></div>
                </div>
                <div class="price-integration row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["integration"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen price-no d-flex align-items-center justify-content-center"></div>
                </div>
                <div class="price-support row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["support"]["title"]?></div>
                    <div class="col-sm-3 col-8 bgreen price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col price-container  d-sm-none d-block mb-4">
                <div class="price-title row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&nbsp;</div>
                    <div class="col-sm-3 col-8 bred"><?=$content["pricing"]["professional"]?></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 100 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">50 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 300 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">80 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 500 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">100 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bred"><span class="price">200 eur<span class="price-under"><?=$content["pricing"]["perMonth"]?></span></span>
                    </div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000+ <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 bred font-weight-bold d-flex align-items-center justify-content-center"><a href="#contact" class="js-scroll-trigger"><?=$content["pricing"]["customPrice"]?></a></div>
                </div>
                <div class="price-discount row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"></div>
                    <div class="col-sm-3 col-8 bred">
                        <div><?=$content["pricing"]["discount6"]?></div>
                        <div><?=$content["pricing"]["discount12"]?></div>
                    </div>
                </div>
                <div class="price-crm row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["crm"]["title"]?></div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-automation row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["automation"]["title"]?></div>
                    <div class="col-sm-3 col-8 bred"><?=$content["pricing"]["automation"]["professional"]?></div>
                </div>
                <div class="price-reports row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["reports"]["title"]?></div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-integration row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["integration"]["title"]?></div>
                    <div class="col-sm-3 col-8 bred "><?=$content["pricing"]["integration"]["professional"]?></div>
                </div>
                <div class="price-support row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["support"]["title"]?></div>
                    <div class="col-sm-3 col-8 bred price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col price-container  d-sm-none d-block">
                <div class="price-title row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&nbsp;</div>
                    <div class="col-sm-3 col-8 byellow"><?=$content["pricing"]["premium"]?></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 100 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 300 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 500 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0 font-weight-bold d-flex align-items-center justify-content-center"><a href="#contact" class="js-scroll-trigger"><?=$content["pricing"]["customPrice"]?></a></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000 <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-students row">
                    <div class="col-sm-3 col-md-2 col-4 price-first">&lt; 1000+ <?=$content["pricing"]["students"]?> </div>
                    <div class="col-sm-3 col-8 byellow border-bottom-0 border-left-0 border-right-0"></div>
                </div>
                <div class="price-discount row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"></div>
                    <div class="col-sm-3 col-8 byellow border-left-0 border-right-0"></div>
                </div>
                <div class="price-crm row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["crm"]["title"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-automation row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["automation"]["title"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-reports row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["reports"]["title"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-integration row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["integration"]["title"]?></div>
                    <div class="col-sm-3 col-8 byellow price-yes d-flex align-items-center justify-content-center">v</div>
                </div>
                <div class="price-support row">
                    <div class="col-sm-3 col-md-2 col-4 price-first"><?=$content["pricing"]["support"]["title"]?></div>
                    <div class="col-sm-3 col-8 byellow d-flex align-items-center justify-content-center"><?=$content["pricing"]["support"]["premium"]?></div>
                </div>
            </div>
        </div>
        <div class="row customization mt-5">
            <div class="col-md-8 offset-md-2 col-sm-12 offset-lg-3 col-lg-6 customization-container bpurple">
                <div class="row border-bottom bpurple">
                    <div class="col bpurple d-flex flex-column align-items-center justify-content-center border-right"><div class="title"><?=$content["pricing"]["customize"]["migrationLine1"]?></div><div><?=$content["pricing"]["customize"]["migrationLine2"]?></div></div>
                    <div class="col"><span class="price">30 eur<span class="price-under"><?=$content["pricing"]["perHour"]?></span></span></div>
                </div>
                <div class="row border-bottom bpurple">
                    <div class="col bpurple d-flex flex-column align-items-center justify-content-center border-right"><div class="title"><?=$content["pricing"]["customize"]["customizationLine1"]?></div><div><?=$content["pricing"]["customize"]["customizationLine2"]?></div></div>
                    <div class="col"><span class="price">50 eur<span class="price-under"><?=$content["pricing"]["perHour"]?></span></span></div>
                </div>
                <div class="row">
                    <div class="col bpurple d-flex flex-column align-items-center justify-content-center border-right"><div class="title"><?=$content["pricing"]["customize"]["supportLine1"]?></div><div><?=$content["pricing"]["customize"]["supportLine2"]?></div><div>&nbsp;</div></div>
                    <div class="col"><span class="price">5 eur<span class="price-under"><?=$content["pricing"]["customize"]["supportLine3"]?></span><span class="price-under1"><?=$content["pricing"]["customize"]["supportLine4"]?></span>
                        </span></div>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="clients">
    <div class="container">
        <div class="row">
            <div class="col">
                <h2 class="title text-center"><?=$conten["customers"]["title"]?></h2>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 clientLogo d-flex align-items-center justify-content-center">
                <a href="https://freedaspace.com/" target="_blank" class="d-flex align-items-center justify-content-center">
                    <img src="/img/clients/freeda.png" alt="Freeda Language Space">
                </a>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 clientLogo d-flex align-items-center justify-content-center">
                <a href="https://www.like-kids.ru" target="_blank" class="d-flex align-items-center justify-content-center">
                    <img src="/img/clients/like_logo.jpg" alt="LIKE Детский монтессори центр">
                </a>
            </div>
        </div>
    </div>
</section>
<section id="about">
    <div class="container">
        <div class="row">
            <div class="col">
                <h2 class="title text-center"><?=$content["about"]["title"]?></h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 col-lg-8 offset-lg-2">
                <img src="/img/Myls_logo_with_tagline.svg" alt="">
                <? foreach ($content["about"]["lines"] as $line): ?>
                    <p><?=$line?></p>
                <? endforeach; ?>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="btnBlock d-flex justify-content-center flex-wrap">
                    <button class="btn btn-primary btn-lg btn-green" type="button"><a href="http://mylscompany.com" target="_blank"><?=$content["about"]["more"]?></a></button>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="contact">
    <div class="container">
        <div class="row">
            <div class="col">
                <h3 class="title text-center light"><?=$content["contact"]["title"]?></h3>

            </div>
        </div>
        <div class="row">
            <div class="col-md-5 offset-md-1">
                <div class="contactBlock col-sm-6 col-md-12">
                    <div class="contactTitle"><?=$content["contact"]["anyQuest"]?></div>
                    <div class="contactText">
                        <a href="mailto:info@myls.education">info@myls.education</a>
                    </div>
                </div>
                <div class="contactBlock col-sm-6 col-md-12">
                    <div class="contactTitle"><?=$content["contact"]["customer"]?></div>
                    <div class="contactText"><a href="mailto:av@myls.education">av@myls.education</a></div>
                </div>
                <div class="contactBlock col-sm-6 col-md-12">
                    <div class="contactTitle"><?=$content["contact"]["technic"]?></div>
                    <div class="contactText"><a href="mailto:aa@myls.education">aa@myls.education</a></div>
                </div>
            </div>
            <div class="col-md-5">
                <form name="sentMessage" id="contactForm">
                    <div class="form-group controls mb-0 pb-2">
                        <input class="form-control" id="name" type="text" placeholder="<?=$content["contact"]["name"]?>" required data-validation-required-message="Name">
                        <div class="invalid-feedback">
                            Name
                        </div>
                    </div>


                    <div class="form-group controls mb-0 pb-2">
                        <input class="form-control" id="email" type="email" placeholder="email" required data-validation-required-message="email">
                        <p class="help-block text-danger"></p>
                    </div>


                    <div class="form-group controls mb-0 pb-2">
                        <textarea class="form-control" id="message" rows="5" placeholder="<?=$content["contact"]["msg"]?>" required data-validation-required-message="Message"></textarea>
                        <p class="help-block text-danger"></p>
                    </div>

                    <div class="form-group controls mb-0 pb-2">
                        <div class="g-recaptcha" id="recaptcha_feedback" data-sitekey="6LfXDrcUAAAAAHcECmcmz9SXmopWbifTR_XfdtE-"></div>
                    </div>


                    <div id="success"></div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-xl" id="sendMessageButton"><?=$content["contact"]["send"]?></button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</section>
<footer>
    <div class="container">
        <div class="row">
            <div class="col copyrightBlock">
                <div class="copyright text-center align-self-center">© Myls 2019</div>
            </div>
        </div>
    </div>
</footer>
<!-- Contact Form JavaScript -->
<script src="/js/jquery-3.3.1.min.js"></script>
<script src="/js/popper.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/js/myls.min.js"></script>
<script src="/js/jqBootstrapValidation.js"></script>
<script src="/js/contact_me.js"></script>
<script src="/jquery-easing/jquery.easing.min.js"></script>
<script src="/js/slick.min.js"></script>

<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>
<script type="text/javascript">
    var onloadCallback = function() {
        mysitekey = '6LfXDrcUAAAAAHcECmcmz9SXmopWbifTR_XfdtE-';
        grecaptcha.render('recaptcha_feedback', {
            'sitekey' : mysitekey
        });
    };
</script>

<script type="text/javascript">
    $(".feature-block-container").slick({
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
    });

</script>

<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(55015873, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
    });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/55015873" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</body>

</html>

