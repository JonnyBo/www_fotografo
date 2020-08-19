<?php
use yii\helpers\Html;

/* @var $user \common\entities\User */

$confirmLink = Yii::$app->urlManager->createAbsoluteUrl(['restore', 'token' => $user->password_reset_token]);
?>


    Привет, <?= Html::encode($user->name) ?> <?= Html::encode($user->surname) ?>!<br><br>
    Нам стало известно о том, что вы забыли пароль для входа на платформу <?=Yii::$app->params['projectName'];?>.<br><br>
    Если это действительно так, кликните <?= Html::a('сюда', $confirmLink, ['style' => ['color' => '#74ACC8']]) ?> и введите новый.<br><br>
    Если вы не запрашивали новый пароль, свяжитесь с нашей службой поддержки <?= Html::mailto(Yii::$app->params['supportEmail'], Yii::$app->params['supportEmail'], ['style' => ['color' => '#74ACC8']]) ?>.<br><br>
    С уважением, команда <?=Yii::$app->params['projectName'];?>