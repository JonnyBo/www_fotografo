<?php

$params = require __DIR__ . '/params.php';

return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_SCHOOL_FREEDA_TABLER.FDB;charset=utf8',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'datadb' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_SCHOOL_FREEDA.FDB;charset=utf8',
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
        'languages' => [
            ['name' => 'English', 'code' => 'en', 'icon' => '', 'default' => true],

            ['name' => 'Русский', 'code' => 'ru', 'icon' => '', 'default' => false],
            // ['name' => 'Español', 'code' => 'es', 'icon' => '', 'default' => false],
        ],
    ],
    'modules' => [
        'api' => [
            'class' => 'app\modules\api\v1\Rest',
        ],

    ],
];

