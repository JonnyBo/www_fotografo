<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */



namespace app\commands;

use app\controllers\FunctionController;
use yii\console\Controller;
use yii\console\ExitCode;
use Yii;
use PDO;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

/**
 * This command echoes the first argument that you have entered.
 *
 * This command is provided as an example for you to learn how to create console commands.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class HelloController extends Controller
{

    use FunctionController;

    public $message;

    public $text;

    public function options($actionID)
    {
        return ['message', 'text'];
    }

    public function optionAliases()
    {
        return ['m' => 'message', 't' => 'text'];
    }

    public function actionIndex()
    {
        echo $this->message . $this->text . "\n";
    }

    public function actionImportuserdata() {
        //$userDir = Yii::$app->basePath . '/userData';
        //$domain = current(explode('.', Yii::$app->getRequest()->serverName, 2));
        $this->function = Yii::$app->sitefunctions;
        if (!$this->message)
            die('не выбран домен');
        $afiles = [];
        $userDir = opendir(Yii::$app->basePath . '/userData');
        while ( ($dir = readdir( $userDir )) !== false ) {
            if ( $dir <> "." && $dir <> ".." ) {
                    $domen = explode('.', $dir)[0];
                    if ($domen == $this->message) {
                        $afiles[$dir] = [];
                        $dirs = opendir(Yii::$app->basePath . '/userData/' . $dir);
                        while ($d = readdir($dirs)) {
                            if ( $d <> "." && $d <> ".." ) {
                                    $afiles[$dir][$d] = [];
                                    $dd = opendir(Yii::$app->basePath . '/userData/' . $dir  . '/' . $d);
                                    while ($file = readdir($dd)) {
                                        if ( $file <> "." && $file <> ".." ) {
                                            if ( preg_match( "/.txt$/i", $file ) ) {
                                                $afiles[$dir][$d][] = Yii::$app->basePath . '/userData/' . $dir  . '/' . $d . '/' . $file;
                                            }
                                        }
                                    }
                                    closedir($dd);
                            }
                        }
                        closedir($dirs);
                    }
                    unset($domen);
            }
        }
        closedir( $userDir );
        reset( $afiles );
        if (!empty($afiles)) {
            $dev_config = require __DIR__ . '/../config/web_' . $this->message . '.php';
            Yii::$app->set('db', $dev_config['components']['db']);
            Yii::$app->set('datadb', $dev_config['components']['datadb']);
            foreach ($afiles as $dd) {
                foreach($dd as $user => $files) {
                    $params = [':user_id' => $user];
                    foreach ($files as $file) {
                        if (strpos($file,'settings.txt') !== false) {
                            //пишем сеттинги
                            $sql = 'update or insert into user_settings(user_id, setting_value) values(:user_id, :setting_value) matching(user_id)';
                            $data = file_get_contents($file);
                            $params[':setting_value'] = $data;
                            $this->executeSQL($sql, $params, Yii::$app->db);
                        } else {
                            $table = basename($file, ".txt");
                            $table_id = intval(substr($table, 5));
                            if ($table_id) {
                                $data = file_get_contents($file);
                                $params[':setting_value'] = $data;
                                $params[':table_id'] = $table_id;
                                $sql = 'update or insert into table_settings(table_id, user_id, setting_value) values(:table_id, :user_id, :setting_value) matching(table_id, user_id)';
                                $this->executeSQL($sql, $params, Yii::$app->db);
                            }
                        }
                    }
                    echo "Загружены сетинги для пользователя " . $user . " \t\n";
                }
            }
        }
    }

    /*
    protected function getTemplatesFromBD() {
        $sql = 'select b.proc_id, b.table_name, b.description, b.rules, b.identificator from bo_procs b order by char_length(b.identificator) desc';
        return $this->selectAll($sql, [], Yii::$app->datadb)['success'];
    }

    protected function getTypesFromDB($table) {

        $result = [];
        $sql = 'select field, type_name from get_table_fields_types(:table_name)';
        $params = [':table_name' => $table];
        $arrTypes = $this->selectAll($sql, $params, Yii::$app->datadb)['success'];
        if (!empty($arrTypes)) {
            foreach ($arrTypes as $type) {
                $result[trim(strtolower($type['field']))] = trim($type['type_name']);
            }
        }
        return $result;
    }

    protected function getStartTemplate($tpl) {
        $result = [];
            $arrRows = explode(';', $tpl);
            if (count($arrRows) > 0) {
                foreach ($arrRows as $row) {
                    $strRow = preg_replace('/^\((.+)\)$/', '$1', $row);
                    $strRow = str_replace("'",'', $strRow);
                    $result[] = explode(',', $strRow);
                }
            } else {
                //нет разделителя в строке
            }
        return $result;
    }

    protected function findStartTemplate($templates, $data) {
        foreach ($templates as $key => $tmp) {
            $rowTpl = $tmp['rowTpl'];
            $tmpl = $tmp['startTpl'];
            $index = array_search('c', array_column($rowTpl, 'type'));
            $startDataRow = $rowTpl[$index]['template'];
            $isTpl = 0;
            for ($i = 0; $i < count($tmpl); $i++) {
                if ($tmpl[$i][0] == '~') {
                    $index = array_search($tmpl[$i][2], $data[$tmpl[$i][1]]);
                    if ($index !== false) {
                        $tmpl[$i][0] = $index;
                        for ($j = 0; $j < count($rowTpl); $j++) {
                            if ($rowTpl[$j]['template'][1] == '~' && $rowTpl[$j]['template'][0] == $tmpl[$i][3]) {
                                $rowTpl[$j]['template'][1] = intval($index) - intval($startDataRow[0]);
                            }
                        }
                    }
                }
                if ($tmpl[$i][1] == '~') {
                    for ($j = 0; $j < count($data); $j++) {
                        if (strpos($data[$j][$tmpl[$i][0]], $tmpl[$i][2]) !== false) {
                            for ($j = 0; $j < count($rowTpl); $j++) {
                                if ($rowTpl[$j]['template'][2] == '~' && $rowTpl[$j]['template'][0] == $tmpl[$i][3]) {
                                    $rowTpl[$j]['search'] = $tmpl[$i][2];
                                }
                            }
                            $isTpl = 1;
                            break;
                        }
                    }
                }
                if ($tmpl[$i][1] == '~') {

                } else {
                    if (mb_stripos($data[$tmpl[$i][1]][$tmpl[$i][0]], $tmpl[$i][2]) !== false) {
                        $isTpl = 1;
                    } else {
                        $isTpl = 0;
                        break;
                    }
                }
            }
            if ($isTpl == 1) {
                $types = $this->getTypesFromDB($tmp['table_name']);
                return ['mainTpl' => $tmpl, 'rowTpl' => $rowTpl, 'startDataRow' => $startDataRow, 'types' => $types, 'proc_id' => $tmp['proc_id']];
            }
        }
        return false;
    }

    protected function getRowTemplate($tmpl) {
        $result = [];
        $arrRows = explode(';', $tmpl);
        if (count($arrRows) > 0) {
            foreach ($arrRows as $key => $row) {
                $row = str_replace("'",'', $row);
                preg_match('/([^\)]+)\((.*)\)/', $row, $res);
                $result[$key]['type'] = $res[1];
                $result[$key]['template'] = explode(',', $res[2]);
            }
        } else {
            //нет разделителя в строке
        }
        return $result;
    }

    protected function getCorrectTime($time) {
        if (preg_match('/^([0-1]\d|2[0-3])(:[0-5]\d){2}$/', $time)) {
            return $time;
        }
        if (preg_match('/^0[.,][0-9]+$/', $time)) {
            return date('H:i', floatval($time) * 86400);
        }
        return false;
    }

    protected function getCorrectDate($date) {
        if (preg_match('/^[0-9]+$/', $date) && intval($date) > 0) {
            return date('Y-m-d', (intval($date) - 25569) * 86400);
        } else {
            $arrDate = Yii::$app->dateparser->parseDate($date);
            if ($arrDate)
                return $arrDate['year'] . '-' . $arrDate['month'] . '-' . $arrDate['day'];
        }
        return false;
    }

    protected function formattedData($data, $type) {
        $result = [];
        if (!empty($data)) {
            foreach ($data as $key => $row) {
                $result[$key] = null;
                if ($type[$key] == 'int') {
                    if (preg_match('/^\d+$/', $row))
                        $result[$key] = intval($row);
                } elseif($type[$key] == 'float') {
                    if (preg_match('/^[+-]?([0-9]*[.])?[0-9]+$/', $row))
                        $result[$key] = floatval($row);
                } elseif ($type[$key] == 'time') {
                    if ($time = $this->getCorrectTime($row))
                        $result[$key] = $time;
                } elseif ($type[$key] == 'date') {
                    if ($date = $this->getCorrectDate($row))
                        $result[$key] = $date;
                } else {
                    $result[$key] = $row;
                }
            }
        }
        return $result;
    }

    protected function getParams($sql, $data) {
        $result = [];
        print_r($data);
        $pp = explode('values', $sql)[1];
        $strPar = preg_replace('/^\((.+)\)$/', '$1', trim($pp));
        $params = explode(',', trim($strPar));
        foreach ($params as $param) {
            $param = trim($param);
            $key = trim(str_replace(':', '', $param));
            if ($data[$key]) {
                $result[$param] = $data[$key];
            } else {
                $result[$param] = null;
            }
        }
        return $result;
    }

    public function actionParseExcel() {
        $start_script = microtime(true);
        $this->function = Yii::$app->sitefunctions;
        $dev_config = require __DIR__ . '/../config/web_local.php';
        Yii::$app->set('datadb', $dev_config['components']['datadb']);

        $ddb = new PDO(Yii::$app->datadb->dsn, Yii::$app->datadb->username, Yii::$app->datadb->password, [PDO::ATTR_PERSISTENT => true]);
        $ddb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $ddb->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);

        $allTemplates = $this->getTemplatesFromBD();
        $allTpls = [];
        if (!empty($allTemplates)) {
            foreach($allTemplates as $key => $table) {
                $allTpls[$key] = $table;
                $allTpls[$key]['startTpl'] = $this->getStartTemplate($table['identificator']);
                $allTpls[$key]['rowTpl'] = $this->getRowTemplate($table['rules']);

            }
        }

        $file = Yii::$app->basePath . '/web/files/attachments/eais1.xlsx';
        $path_info = pathinfo($file);
        $inputFileType = ucfirst($path_info['extension']);
        $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);

        $reader->setReadDataOnly(true);

        $spreadsheet = $reader->load($file);
        $loadedSheetNames = $spreadsheet->getSheetNames();
        foreach ($loadedSheetNames as $sheetIndex => $loadedSheetName) {
            //if ($sheetIndex == 2) {
                $result = [];

                $worksheet = $spreadsheet->getSheet($sheetIndex)->toArray();
                for ($i = 0; $i < count($worksheet); $i++) {
                    if (!array_filter($worksheet[$i]))
                        unset($worksheet[$i]);
                }
                $data = array_values($worksheet);
                $allTemplate = $this->findStartTemplate($allTpls, $data);

                $current = [];
                if ($allTemplate) {
                    $rowTpl = $allTemplate['rowTpl'];
                    $startDataRow = $allTemplate['startDataRow'];
                    $proc_id = $allTemplate['proc_id'];
                    $types = $allTemplate['types'];

                    $sql = 'insert into bo_load (email_id, attachment_id, proc_id, sheet, film, cinema, add_cinema, city, bo_date, bo_time, bo, screens, audition) values (:email_id, :attachment_id, :proc_id, :sheet, :film, :cinema, :add_cinema, :city, :bo_date, :bo_time, :bo, :screens, :audition)';

                    $ddb->beginTransaction();
                    $prepare = $ddb->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));

                    for ($i = $startDataRow[1]; $i < count($data); $i++) {
                        foreach ($rowTpl as $tpl) {

                            if ($tpl['type'] == 'f') {
                                if ($tpl['template'][2] == '~') {
                                    //ищем совпадение и если есть выводим
                                    $row = $i;
                                    if ($data[$row][$tpl['template'][1]]) {
                                        if (strpos($data[$row][$tpl['template'][1]], $tpl['search']) !== false) {
                                            $search = trim(str_replace($tpl['search'], '', $data[$row][$tpl['template'][1]]));
                                            if ($current[$tpl['template'][0]] != $search) {
                                                $current[$tpl['template'][0]] = $search;
                                            }
                                        }
                                    }
                                    $result[$i][$tpl['template'][0]] = $current[$tpl['template'][0]];
                                } else {
                                    $row = intval($startDataRow[0]) + intval($tpl['template'][1]);
                                    $result[$i][$tpl['template'][0]] = $data[$i][$row];
                                }
                            }
                            if ($tpl['type'] == 'fx') {
                                if (strpos($tpl['template'][1], '#') !== false)
                                    $result[$i][$tpl['template'][0]] = str_replace('#', '', $tpl['template'][1]);
                                else
                                    $result[$i][$tpl['template'][0]] = $data[$tpl['template'][2]][$tpl['template'][1]];
                            }
                            if ($tpl['type'] == 's') {
                                if ($result[$i][$tpl['template'][0]] == $tpl['template'][1]) {
                                    unset($result[$i]);
                                }
                            }
                        }
                        if (!empty($result[$i])) {
                            $result[$i] = $this->formattedData($result[$i], $types);
                            $result[$i]['proc_id'] = $proc_id;
                            //пишем в базу результат
                            $params = $this->getParams($sql, $result[$i]);

                            $prepare->execute($params);

                        }
                    }
                    $ddb->commit();
                } else {
                    //не найден начальный шаблон для файла
                    echo $loadedSheetName . ' не найден начальный шаблон для файла' . "\n";
                }
            //}
            print_r($result);
        }
        $time = microtime(true) - $start_script;
        echo ' - Скрипт выполнялся '.$time.' сек.' . "\t\n";
    }
    */

}


