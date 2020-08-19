<?php

$params = require __DIR__ . '/params.php';

return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            //'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\myls_fd_TABLER.FDB;charset=utf8',

            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_ALLMEDIASTAT_TABLER.FDB;charset=utf8',
            'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_EVENTS_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_fd_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\myls_fd_TABLER.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_SCHOOL_FREEDA_TABLER.FDB;charset=utf8',

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
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_ALLMEDIASTAT.FDB;charset=utf8',
            'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_EVENTS.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=d:\dbs\film_distribution.FDB;charset=utf8',
            //'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_SCHOOL_FREEDA.FDB;charset=utf8',
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
        'imageresize' => [
            'class' => 'fgh151\imageresize\ImageResize',
            //path web root
            'cachePath' => '@frontend/web',
            //path where to store thumbs
            'cacheFolder' => 'upload/thumb',
            //use filename (seo friendly) for resized images else use a hash
            'useFilename' => true,
            //show full url (for example in case of a API)
            'absoluteUrl' => false,
        ],
    ],
    'params' => [
        'adminEmail' => 'admin@example.com',
        'projectName' => 'AllMedia.VOD',
        'logoCode' => 'AM',
        'logoColor' => '#F07A71',
        'languages' => [
            ['name' => 'English', 'code' => 'en', 'icon' => '', 'default' => true],
            ['name' => 'Русский', 'code' => 'ru', 'icon' => '', 'default' => false],
            // ['name' => 'Español', 'code' => 'es', 'icon' => '', 'default' => false],
        ],
        'bgImg' => 'img/background.svg',
        'bgColor' => '',
        'pathFavicons' => 'img/favicons/',
        'bgLogoImg' => false,
        'logo' => [
            'logoImg' => 'img/ALLMEDIA-LOGO.svg',
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
            'bgLogoImg' => 'http://myls.events/img/ALLMEDIA-LOGO.png',
            'imgLogo' => 'http://myls.events/img/ALLMEDIA-LOGO.png',
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




