<?php

error_reporting(E_ERROR);

$is_dev = strpos($_SERVER['HTTP_HOST'], 'dev.') !== false;
$is_dev = true;
if ($is_dev){
    defined('YII_DEBUG') or define('YII_DEBUG', true);
    defined('YII_ENV') or define('YII_ENV', 'dev');
}

function setMyConfig($config, $new_config) {
    //print_r($config);
    //print_r($new_config);
    $result = [];
    foreach ($config as $index => $conf) {
        $result[$index] = $conf;

        foreach($new_config as $new_conf) {
            foreach ($new_conf as $key => $nc)  {
                if (array_key_exists($key, $conf)) {
                    $result[$index][$key] = $nc;
                }
            }
        }

    }

    //print_r($result);
    return $result;
}



//require __DIR__ . '/../../yii2-basic/vendor/autoload.php';//для приложения
//require __DIR__ . '/../../yii2-basic/vendor/yiisoft/yii2/Yii.php';//для приложения

require __DIR__ . '/../../../yii2-basic/vendor/autoload.php';//для админки
require __DIR__ . '/../../../yii2-basic/vendor/yiisoft/yii2/Yii.php';//для админки

$config = require __DIR__ . '/../config/web.php';
$domen = current(explode('.', $_SERVER['HTTP_HOST'], 2));

if ($_SERVER['HTTP_HOST'] == 'myls.education' or $_SERVER['HTTP_HOST'] == 'www.myls.education') {
    $config = require __DIR__ . '/../config/web.php';
} elseif (strpos($_SERVER['HTTP_HOST'], $domen . '.') !== false) {
    if (file_exists(__DIR__ . '/../config/web_' . $domen . '.php')) {

        $conf = require __DIR__ . '/../config/web_' . $domen . '.php';
        $config = array_replace_recursive($config, $conf);
        //$config = setMyConfig($config, $conf);
    }

}


(new yii\web\Application($config))->run();
