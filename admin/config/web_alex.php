<?php

$params = require __DIR__ . '/params.php';

return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\myls_fd_TABLER.FDB;charset=utf8',

            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_ALLMEDIASTAT_TABLER.FDB;charset=utf8',
            'dsn' => 'firebird:dbname=d:\dbs\MYLS_events_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_fd_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\myls_fd_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_SCHOOL_FREEDA_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_SCHOOL_FREEDA_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_jeiss_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_allmediastat_tabler.FDB;charset=utf8',
            'username' => 'SYSDBA',
            'password' => 'masterkey',
            //'username' => 'admin',
            //'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'datadb' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_ALLMEDIASTAT.FDB;charset=utf8',
            'dsn' => 'firebird:dbname=d:\dbs\MYLS_events.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_SCHOOL_FREEDA.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\MYLS_jeiss.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_allmediastat.FDB;charset=utf8',
            'username' => 'SYSDBA',
            'password' => 'masterkey',
            //'username' => 'admin',
            //'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'AssetsMinify' => [
            'enabled' => false,
        ],
        'assetManager' => [
            'appendTimestamp' => false,
        ],
        'dateparser' => [
            'class' => 'app\components\DateParser',
        ],
        'boemailparser' => [
            'class' => 'app\components\BoemailParser',
        ],
    ],
    'params' => [
        'bgLogoImg' => false,
        'logo' => [
            'logoImg' => 'img/ALLMEDIA-LOGO.svg',
            'auth' => 'img', //img, text
            'app' => 'txt', //img, text
            'onlyLogo' => true,
            'width'=> '100%',
            'height'=> '50px'
        ],
        'mail' => [
            'bgImg' => 'http://allmedia.myls.events/img/background.png',
            'bgColor' => '',
            'bgLogoImg' => '',
            'imgLogo' => 'http://allmedia.myls.events/img/ALLMEDIA-LOGO_email.png',
            //'pathFavicons' => 'img/favicons/',
        ]
    ],
    'modules' => [
        'banks' => [
            'class' => 'app\modules\banks\ClientModule',
        ],
        'boemail' => [
            'class' => 'app\modules\boemail\ClientModule',
        ],
        'allmedia' => [
            'class' => 'app\modules\allmedia\ClientModule',
        ],
    ],
];




