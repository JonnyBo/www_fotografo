<?php

/* @var $this \yii\web\View */

/* @var $content string */

use app\widgets\Alert;
use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use app\assets\MainHeadAsset;
use app\assets\MainEndAsset;
use app\modules\banks\assets\BankAsset;

AppAsset::register($this);
MainHeadAsset::register($this);
MainEndAsset::register($this);
if (Yii::$app->modules['banks']) {
    BankAsset::register($this);
}
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
    <meta name="format-detection" content="telephone=no"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap&subset=cyrillic-ext"
          rel="stylesheet">

    <link rel="apple-touch-icon" sizes="180x180" href="<?= Yii::$app->params['pathFavicons']; ?>apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?= Yii::$app->params['pathFavicons']; ?>favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?= Yii::$app->params['pathFavicons']; ?>favicon-16x16.png">
    <link rel="manifest" href="<?= Yii::$app->params['pathFavicons']; ?>site.webmanifest">
    <link rel="mask-icon" href="<?= Yii::$app->params['pathFavicons']; ?>safari-pinned-tab.svg" color="#5bbad5">
    <link rel="shortcut icon" href="<?= Yii::$app->params['pathFavicons']; ?>favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-config" content="<?= Yii::$app->params['pathFavicons']; ?>browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <base href="/">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Yii::$app->params['projectName']; ?></title>

    <script>
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', function () {
				navigator.serviceWorker.register('/sw.js').then(
					function (registration) {
						// Registration was successful
						console.log('ServiceWorker registration successful with scope: ', registration.scope);
					},
					function (err) {
						// registration failed :(
						console.log('ServiceWorker registration failed: ', err);
					});
			});
		}
    </script>

    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<?php
function addHashToFile($file)
{
    return YII_ENV_DEV ? $file : $file . '?' . hash_file('md5', $file);
}
?>
<div class="app-container">
    <div id="toolbar"></div>
    <div id="drawer">
        <div id="content" class="dx-theme-background-color d-flex flex-column">
            <?= $content ?>
        </div>
    </div>
</div>
<div id="tooltip"></div>
<div id="main-loadpanel"></div>
<script>
	let siteName = "<?=Yii::$app->params['projectName'];?>";
	let siteColor = "<?=Yii::$app->params['logo']['logoColor'];?>";
	let languages = <?=json_encode(Yii::$app->params['languages']);?>;
	let logo = {
		logoImg: "<?=Yii::$app->params['logo']['logoImg'];?>",
		logoCode: "<?=Yii::$app->params['logo']['logoCode'];?>",
		logoColor: "<?=Yii::$app->params['logo']['logoColor'];?>",
		auth: "<?=Yii::$app->params['logo']['auth'];?>",
		app: "<?=Yii::$app->params['logo']['app'];?>"
	};
</script>
<?php $this->endBody() ?>


</body>
</html>
<?php $this->endPage() ?>
