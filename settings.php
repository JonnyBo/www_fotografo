<?php
$db_charset = 'utf8';
$db_dsn = 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_JEISS_TABLER.FDB;charset='.$db_charset;
$datadb_dsn = 'firebird:dbname=i:\NewServer\data\DB_FB\MYLS_JEISS.FDB;charset='.$db_charset;
$db_user = 'SYSDBA';
$db_password = 'masterkey';



$db = new \PDO($db_dsn, $db_user, $db_password, [\PDO::ATTR_PERSISTENT => true]);
$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
$db->setAttribute(\PDO::ATTR_CASE, \PDO::CASE_LOWER);
$db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);

$datadb = new \PDO($datadb_dsn, $db_user, $db_password, [\PDO::ATTR_PERSISTENT => true]);
$datadb->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
$datadb->setAttribute(\PDO::ATTR_CASE, \PDO::CASE_LOWER);
$datadb->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
