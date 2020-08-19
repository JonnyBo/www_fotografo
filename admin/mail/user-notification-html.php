<?php
use yii\helpers\Html;

/* @var $user \common\entities\User */

?>

Привет, <?=$name?>!<br>
<br>
<?= $message ?><br>
<br>
Есть вопросы? Пишите в нашу службу поддержки: <?= Html::mailto(Yii::$app->params['supportEmail'], Yii::$app->params['supportEmail'], ['style' => ['color' => '#74ACC8']]) ?><br>
<br>
С уважением, команда <?=Yii::$app->params['projectName'];?>
