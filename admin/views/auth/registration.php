<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;

$this->title = 'Registration';
$this->params['breadcrumbs'][] = $this->title;
?>
<? if (Yii::$app->params['bgLogoImg'] !== false): ?>
    <img src="<?=Yii::$app->params['bgLogoImg'];?>" class="myls-login-cover" alt="">
<? endif;?>
<div class="myls-login-form">
    <?= $this->render('title'); ?>
    <form action="" id="form-container" method="post">
        <!--input type="hidden" name="token"  id="token" value="<?=Yii::$app->request->get('token', false)?>"-->
        <div id="mylsRegistrationForm"></div>
        <input type="hidden" id="company_id" name="company_id">
    </form>
</div>

<script>
    $(function() {
        var message = false;
        if (message) {
            DevExpress.ui.notify({
                message: message,
                position: {
                    my: "center top",
                    at: "center top"
                }
            }, 'error', 3000);
        }
    });
</script>
