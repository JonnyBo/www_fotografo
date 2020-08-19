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
class MainHeadAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'components/golden-layout/goldenlayout-base.css',
        'components/golden-layout/goldenlayout-light-theme.css',
        'css/spectrum.css',
    ];
    public $js = [
        'components/detect.js',
        'components/ckeditor5/ckeditor.js',
        'components/ace/ace.js',
        'components/golden-layout/goldenlayout.js',
        'components/devExtreme/Lib/js/dx.all.js',
        'components/devExtreme/Lib/js/localization/dx.messages.ru.js',
        'components/devExtreme/Lib/js/vectormap-data/world.js',
        'components/jquery.color-2.1.2.js',
        'components/spectrum.js',
        'components/resize-sensor/resizeSensor.min.js',
        'components/sortablejs/Sortable.min.js',
        'components/md5.js',
        'components/md5.js',
        'components/jquery.cookie.js',
    ];
    public $jsOptions = [
        'position' => \yii\web\View::POS_HEAD
    ];
}
