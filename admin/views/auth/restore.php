<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Restore';
$this->params['breadcrumbs'][] = $this->title;
?>
<? if (Yii::$app->params['bgLogoImg'] !== false): ?>
    <img src="<?=Yii::$app->params['bgLogoImg'];?>" class="myls-login-cover" alt="">
<? endif;?>
<div class="myls-login-form">
    <?= $this->render('title'); ?>
    <form action="restore" id="form-container" method="post">
        <div id="mylsRestoreForm"></div>
    </form>
</div>

