    <div class="mylsLoginTitle d-flex">
        <? if(Yii::$app->params['logo']['auth'] == 'img'):?>
            <div class="mylsIconImage mr-2" style="width: <?=Yii::$app->params['logo']['width'];?>; height: <?=Yii::$app->params['logo']['height'];?>">
                <img src="<?=Yii::$app->params['logo']['logoImg'];?>">
            </div>
        <? else:?>
            <div class="mylsIcon d-flex justify-content-center align-items-center" style="background-color: <?=Yii::$app->params['logo']['logoColor'];?>;width: <?=Yii::$app->params['logo']['width'];?>; height: <?=Yii::$app->params['logo']['height'];?>">
                <span><?= Yii::$app->params['logo']['logoCode'];?></span>
            </div>
        <?endif;?>
        <? if(Yii::$app->params['logo']['onlyLogo'] === false):?>
            <div class="mylsTitle"  style="color: <?=Yii::$app->params['logoColor'];?>"><?=Yii::$app->params['projectName'];?></div>
        <? endif; ?>
    </div>