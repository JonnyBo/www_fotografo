<?php

$params = require __DIR__ . '/params.php';

return [
    'components' => [
        'db' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_jeiss_tabler.FDB;charset=utf8',
            //'username' => 'SYSDBA',
            //'password' => 'masterkey',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'datadb' => [
            'class' => 'edgardmessias\db\firebird\Connection',
            'dsn' => 'firebird:dbname=138.201.19.133/53051:c:\dbs\MYLS_jeiss.FDB;charset=utf8',
            //'username' => 'SYSDBA',
            //'password' => 'masterkey',
            'username' => 'admin',
            'password' => 'ybvlf14njh',
            'charset' => 'utf8',
            'attributes' => [PDO::ATTR_PERSISTENT => true]
        ],
        'AssetsMinify' => [
            'enabled' => false,
        ],
        'assetManager' => [
            'appendTimestamp' => false,
        ],
        'mailermg' => [
            'class' => 'boundstate\mailgun\Mailer',
            'key' => 'bf1dd2f7acbe2d0530eab4784d707161-7fba8a4e-76148940',
            'domain' => 'sandboxd8eebc8fba4d4376a08bbf3b264382d2.mailgun.org',
        ],
    ],
    'params' => [
        'adminEmail' => 'admin@example.com',
        'projectName' => 'Jeisson Pulido Fotografo',
        'logoCode' => 'JP',
        'logoColor' => '#F07A71',
        'languages' => [
            ['name' => 'English', 'code' => 'en', 'icon' => '', 'default' => true],
            //['name' => 'Русский', 'code' => 'ru', 'icon' => '', 'default' => false],
             //['name' => 'Español', 'code' => 'es', 'icon' => '', 'default' => false],
        ],
        'bgImg' => 'img/background.svg',
        'bgColor' => '',
        'pathFavicons' => 'img/favicons/',
        'bgLogoImg' => false,
        'logo' => [
            'logoImg' => 'img/JPF.svg',
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
            'bgLogoImg' => 'http://myls.events/img/JPF.png',
            'imgLogo' => 'http://myls.events/img/JPF.png',
            //'pathFavicons' => 'img/favicons/',
        ]
    ],
    'modules' => [
        'boemail' => [
            'class' => 'app\modules\boemail\ClientModule',
        ],
    ],
];

