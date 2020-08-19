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
class AuthEndAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/myls.css',
        'css/myls.light.colors.css',
    ];
    public $js = [
        'js/myls-localization.js',
        'js/appCore.js',
        'js/auth.js'
    ];
    public $jsOptions = [
        'position' => \yii\web\View::POS_END
    ];
}