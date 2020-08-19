<?php

namespace app\modules\banks\assets;

use yii\web\AssetBundle;

class BankAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    /*public $js = [
        'js/modules/banksdocument.js',
    ];*/
    public $depends = [
    //'yii\web\YiiAsset',
    //'yii\bootstrap4\BootstrapAsset',
    ];
    public $jsOptions = [
        'position' => \yii\web\View::POS_END
    ];
}