<?php

return [
/*
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=localhost;dbname=yii2basic',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
*/
    'class' => 'edgardmessias\db\firebird\Connection',
    //'dsn' => 'firebird:dbname=188.93.210.100/53051:c:\dbs\EDDY_EVENTS.FDB;charset=utf8',
    //'dsn' => 'firebird:dbname=localhost:D:\DBs\MYLSEVENTS.FDB;charset=utf8',
    //'dsn' => 'firebird:dbname=138.201.19.133/53051:C:\dbs\myls_school_test.FDB;charset=utf8',
    //'dsn' => 'firebird:dbname=localhost:D:\dbs\myls_school.FDB;charset=utf8',
    //'dsn' => 'firebird:dbname=31.28.23.249:d:\cp_db\MYLSEVENTS.FDB;charset=utf8',
    'dsn' => 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_JEISS.FDB;charset=utf8',

    //'username' => 'admin',
    //'password' => 'ybvlf14njh',
    'username' => 'SYSDBA',
    'password' => 'masterkey',

    'charset' => 'utf8',
    'attributes' => [PDO::ATTR_PERSISTENT => true]

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
