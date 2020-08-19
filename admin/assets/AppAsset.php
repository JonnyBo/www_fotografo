<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'components/devExtreme/Lib/css/dx.common.css',
        'css/dx.generic.myls-blue-light-compact.css',
        'font-awesome/css/font-awesome.min.css',
        'css/bootstrap.min.css',
    ];
    public $js = [
        'components/devExtreme/Lib/js/jquery.min.js',
        'components/jquery.cookie.js',
        'components/md5.js',
        'components/devExtreme/Lib/js/jszip.min.js',
    ];
    public $depends = [
        //'yii\web\YiiAsset',
        //'yii\bootstrap4\BootstrapAsset',
    ];
    public $jsOptions = [
        'position' => \yii\web\View::POS_HEAD
    ];
}
