<?php

$params = require __DIR__ . '/params.php';
return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_EVENTS_TABLER.FDB;charset=utf8',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
        ],
        'datadb' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_EVENTS.FDB;charset=utf8',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
        ],
        'AssetsMinify' => [
            'enabled' => true,
        ],
        'assetManager' => [
            'appendTimestamp' => true,
        ],
    ],
    'params' => [
        'adminEmail' => 'admin@example.com',
        'projectName' => 'Cardiostim ERP',
        'logoCode' => 'Cs',
        'logoColor' => '#F07A71',
        'languages' => [
           // ['name' => 'English', 'code' => 'en', 'icon' => '', 'default' => true],
            ['name' => 'Русский', 'code' => 'ru', 'icon' => '', 'default' => true],
            // ['name' => 'Español', 'code' => 'es', 'icon' => '', 'default' => false],
        ],
        'bgImg' => 'img/cardiostim/main_bg1.jpg',
        'bgColor' => '',
        'bgLogoImg' => false,
        'logo' => [
            'logoImg' => 'img/cardiostim/cardiostim_logo.svg',
            'auth' => 'img', //img, text
            'app' => 'img', //img, text
            'onlyLogo' => true,
            'width'=> '100%',
            'height'=> 'auto'
        ],
        'tokenLifeTime' => 3600*24,
        'supportEmail' => 'support@myls.events',
        'documentation' => false,
        'mail' => [
            'bgImg' => 'http://myls.events/img/background.png',
            'bgColor' => '',
            'bgLogoImg' => '',
            'imgLogo' => 'http://myls.events/img/cardiostim/cardiostim_logo.png',
            //'pathFavicons' => 'img/favicons/',
        ],
        'pathFavicons' => 'img/favicons/cardiostim/',
    ],
];

