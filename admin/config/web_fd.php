<?php

$params = require __DIR__ . '/params.php';

return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\myls_fd_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\myls_fd_TABLER.FDB;charset=utf8',
           // 'username' => 'SYSDBA',
            //'password' => 'masterkey',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'datadb' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\myls_fd.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_fd_TABLER_dev.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\film_distribution.FDB;charset=utf8',
            //'username' => 'SYSDBA',
            //'password' => 'masterkey',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
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
        'projectName' => 'Myls.Film Distribution',
        'logoCode' => 'FD',
        'logoColor' => '#F07A71',
        'languages' => [
            //['name' => 'English', 'code' => 'en', 'icon' => '', 'default' => true],
            ['name' => 'Русский', 'code' => 'ru', 'icon' => '', 'default' => false],
            // ['name' => 'Español', 'code' => 'es', 'icon' => '', 'default' => false],
        ],
        'bgImg' => 'img/background.svg',
        'bgColor' => '',
        'bgLogoImg' => 'img/cover.png',
        'pathFavicons' => 'img/favicons/',
        'logo' => [
            'logoImg' => '',
            'logoCode' => 'Sc',
            'logoColor' => '#F07A71',
            'auth' => 'text', //img, text
            'app' => 'text', //img, text
        ],
        'tokenLifeTime' => 3600*24,
    ],
    'modules' => [
        'banks' => [
            'class' => 'app\modules\banks\ClientModule',
        ],

    ],
];

