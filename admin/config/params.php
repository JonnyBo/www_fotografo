<?php

return [
    'adminEmail' => 'admin@example.com',
    'projectName' => 'Myls.school',
    'logoCode' => 'Sc',
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
        'onlyLogo' => false,
        'width' => '32px',
        'height' => '32px',
    ],
    'tokenLifeTime' => 3600*24,
    'supportEmail' => 'support@myls.education',
    'documentation' => [
        [
        'text' => 'основными принципами работы на платформе',
        'link' => 'https://www.manula.com/manuals/myls/myls-school-knowledge-base/1/ru/topic/myls-school-how-to-work',
        'options' => ['style' => ['color' => '#74ACC8']]
        ],
        [
            'text' => 'кратким руководством пользователя',
            'link' => 'https://www.manula.com/manuals/myls/myls-school-knowledge-base/1/ru/topic/myls-school-quick-start-guide',
            'options' => ['style' => ['color' => '#74ACC8']]
        ]
    ],
    'mail' => [
        'bgImg' => 'https://myls.education/img/background.png',
        'bgColor' => '',
        'bgLogoImg' => 'https://myls.education/img/cover_email.png',
        'imgLogo' => 'https://myls.education/img/myls_school.png',
        //'pathFavicons' => 'img/favicons/',
    ]
];
