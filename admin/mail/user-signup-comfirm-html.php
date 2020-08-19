<?php
use yii\helpers\Html;

/* @var $user \common\entities\User */

$confirmLink = Yii::$app->urlManager->createAbsoluteUrl(['signup-confirm', 'token' => $user->email_confirm_token]);
?>


    Привет, <?= Html::encode($user->name) ?> <?= Html::encode($user->surname) ?>!<br><br>
    Добро пожаловать на платформу <?=Yii::$app->params['projectName'];?><br><br>
    Чтобы приступить к работе на платформе, кликните <?= Html::a('сюда', $confirmLink, ['style' => ['color' => '#74ACC8']]) ?>.<br><br>
<?php if (Yii::$app->params['documentation']) : ?>
    Перед началом работы советуем ознакомиться с
    <?php foreach (Yii::$app->params['documentation'] as $key => $docs) : ?>
        <?php if ($key > 0) : ?>
            ,
        <?php endif; ?>
        <?= Html::a($docs['text'], $docs['link'], $docs['options']) ?>
    <?php endforeach; ?>
    <br>Остались вопросы по работе платформы? Мы будем рады ответить на них!<br><br>
<?php endif; ?>
    Пишите в нашу службу поддержки: <?= Html::mailto(Yii::$app->params['supportEmail'], Yii::$app->params['supportEmail'], ['style' => ['color' => '#74ACC8']]) ?><br><br>
    С уважением, команда <?=Yii::$app->params['projectName'];?>

