<?php
use yii\helpers\Html;

/* @var $user \common\entities\User */

?>

Привет!<br><br>Для регистрации на платформе <?=Yii::$app->params['projectName'];?> кликните <?= Html::a('сюда', $link, ['style' => ['color' => '#74ACC8']]) ?> и следуйте указаниям системы.<br><br>Есть вопросы по регистрации? Пишите в нашу службу поддержки: <?= Html::mailto(Yii::$app->params['supportEmail'], Yii::$app->params['supportEmail'], ['style' => ['color' => '#74ACC8']]) ?><br><br>С уважением, команда <?=Yii::$app->params['projectName'];?>
