<?php
namespace app\components;

use app\models\User;
use League\Flysystem\Exception;
use Yii;
use PDO;
use yii\base\Component;
use app\components\SiteFunctions;
use app\controllers\FunctionController;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class BoemailParser extends Component {

    use FunctionController;

    protected $function;

    public function __construct()
    {
        $this->function = Yii::$app->sitefunctions;
    }

    public function receivingEmails($site) {

        try {
            //$this->function = Yii::$app->sitefunctions;
            $dev_config = require dirname(__DIR__) . '/config/web_' . $site . '.php';
            Yii::$app->set('datadb', $dev_config['components']['datadb']);
            $storage = new \afinogen89\getmail\storage\Pop3(['host' => 'pop.gmail.com', 'user' => 'evgeny.e.borisov@gmail.com', 'password' => 'dbrecbr28', 'ssl' => 'SSL']);
            //echo $storage->countMessages() . PHP_EOL;
            $result = [];
            for ($i = 1; $i <= $storage->countMessages(); $i++) {
                $res = [];
                //$res['id'] = $i;
                $msg = $storage->getMessage($i);
                $res['from'] = $msg->getHeaders()->getFrom();
                $res['from_name'] = $msg->getHeaders()->getFromName();
                //$res['to'] = $msg->getHeaders()->getTo();
                $res['date'] = $msg->getHeaders()->getDate();
                $res['subject'] = $msg->getHeaders()->getSubject();
                $res['message_id'] = $msg->getHeaders()->getMessageId();
                $content = '';
                foreach ($msg->getParts() as $part) {
                    $content .= $part->getContentDecode();
                }
                $res['content'] = $content;


                $sql = 'select email_id from insert_bo_email (:email_from, :email_name, :subject, :body, :email_date, :uid)';
                $params = [
                    ':email_from' => $res['from'],
                    ':email_name' => $res['from_name'],
                    ':subject' => $res['subject'],
                    ':body' => $res['content'],
                    ':email_date' => date('Y-m-d H:i:s', strtotime($res['date'])),
                    ':uid' => $res['message_id'],
                ];



                $out = $this->selectOne($sql, $params, Yii::$app->datadb)['success'];
                if (!empty($out) && $out['email_id']) {
                    $params[':bo_email'] = $out['email_id'];
                    $attachments = [];
                    foreach ($msg->getAttachments() as $attachment) {
                        //$attachments[] = $this->saveAttachment($attachment->filename);
                        $attach = $this->saveAttachment($attachment->filename, $attachment->getData(), $out['email_id']);
                        $attachments[] = $attach;
                    }
                    $res['attachment'] = $attachments;
                }
                if (!empty($attachments)) {
                    $this->parseData($out['email_id'], $attachments, $params);
                }

            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    protected function saveAttachment($attachment, $data, $email_id) {
        $dirname = Yii::$app->basePath . '/web/files/attachments/' . date('Y_m');
        if (!file_exists($dirname)) {
            mkdir($dirname, 0777);
        }
        $filename = md5(microtime().$attachment) . '_' . $attachment;
        file_put_contents($dirname . '/' . $filename, $data);
        //filename - входное имяя файла
        //myls_filename - сохраненное имя файла с путем
        $sql = 'insert into bo_attachments (email_id, filename, myls_filename) values (:email_id, :filename, :myls_filename) returning attachment_id';
        $params = [
            ':email_id' => $email_id,
            ':filename' => $attachment,
            ':myls_filename' => $dirname . '/' . $filename
        ];
        $res = $this->selectOne($sql, $params, Yii::$app->datadb);
        if ($res['error'])
            throw new yii\base\ErrorException($res['error']);
        $result = $res['success'];
        $params[':attachment_id'] = $result['attachment_id'];
        return $params;
    }

    protected function getTemplatesFromBD() {
        $sql = 'select b.proc_id, b.table_name, b.description, b.rules, b.identificator, b.is_proc from bo_procs b order by char_length(b.identificator) desc';
        $result = $this->selectAll($sql, [], Yii::$app->datadb);
        if ($result['error'])
            throw new yii\base\ErrorException($result['error']);
        return $result['success'];
    }

    protected function getTypesFromDB($table) {

        $result = [];
        $sql = 'select field, type_name, field_num from get_table_fields_types(:table_name)';
        $params = [':table_name' => $table];
        $res = $this->selectAll($sql, $params, Yii::$app->datadb);
        if ($res['error'])
            throw new yii\base\ErrorException($res['error']);
        $arrTypes = $res['success'];
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
        //print_r($data);
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
                return ['mainTpl' => $tmpl, 'rowTpl' => $rowTpl, 'startDataRow' => $startDataRow, 'types' => $types, 'proc_id' => $tmp['proc_id'], 'table_name' => $tmp['table_name'], 'is_proc' => $tmp['is_proc']];
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
        if (preg_match("/\d{4}\-\d{2}-\d{2}/", $date)) {
            return $date;
        } elseif (preg_match('/^[0-9]+$/', $date) && intval($date) > 0) {
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
                $key = strtolower($key);
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
        $pp = explode('values', $sql)[1];
        if ($pp)
            $strPar = preg_replace('/^\((.+)\)$/', '$1', trim($pp));
        else
            $strPar = preg_replace('/^\((.+)\)$/', '$1', trim(strstr($sql, '(')));
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

    protected function parseData($email_id, $attachments, $info) {
        foreach ($attachments as $key => $attachment) {
            if (preg_match( "/.csv$|.xls$|.xlsx$/i", $attachment[':myls_filename'] )) {
                $this->parseExcelFile($attachment[':myls_filename'], $email_id, $attachment[':attachment_id'], $attachment[':filename'], $info);
            }
        }
    }

    protected function getBoInsertSql() {
        $sql = "select setting_value from sys_settings s where s.setting_name = 'bo_insert'";
        $result = $this->selectOne($sql, [], Yii::$app->datadb)['success'];
        return $result['setting_value'];
    }

    public function parseExcelFile($file, $email_id = null, $attachment_id = null, $filename = null, $info = []) {
        $start_script = microtime(true);

        try {

            $errors = [];
            $this->function = Yii::$app->sitefunctions;

            //$dev_config = require dirname(__DIR__) . '/config/web_local.php';
            //Yii::$app->set('datadb', $dev_config['components']['datadb']);


            //$sql = $this->getBoInsertSql();

            $ddb = new PDO(Yii::$app->datadb->dsn, Yii::$app->datadb->username, Yii::$app->datadb->password, [PDO::ATTR_PERSISTENT => true]);
            $ddb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $ddb->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);

            $allTemplates = $this->getTemplatesFromBD();
            $allTpls = [];
            if (!empty($allTemplates)) {
                foreach ($allTemplates as $key => $table) {
                    $allTpls[$key] = $table;
                    $allTpls[$key]['startTpl'] = $this->getStartTemplate($table['identificator']);
                    $allTpls[$key]['rowTpl'] = $this->getRowTemplate($table['rules']);

                }
            }

            //$file = Yii::$app->basePath . '/alltest/YouTube_AllMediaCompanyLLC_Ecommerce_pos_transactional_RU_M_20200501_20200531_v1-2.csv';
            $path_info = pathinfo($file);
            $inputFileType = ucfirst($path_info['extension']);
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
            if ($inputFileType == 'Csv')
                $reader->setDelimiter(',');
            /**  Advise the Reader that we only want to load cell data  **/
            $reader->setReadDataOnly(true);
            /**  Load $inputFileName to a Spreadsheet Object  **/
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
                //print_r($allTemplate);
                $current = [];
                if ($allTemplate) {
                    $rowTpl = $allTemplate['rowTpl'];
                    $startDataRow = $allTemplate['startDataRow'];
                    $proc_id = $allTemplate['proc_id'];
                    $types = $allTemplate['types'];
                    $table_name = $allTemplate['table_name'];
                    $is_proc = $allTemplate['is_proc'];

                    //$sql = 'insert into bo_load (email_id, attachment_id, proc_id, sheet, film, cinema, add_cinema, city, bo_date, bo_time, bo, screens, audition) values (:email_id, :attachment_id, :proc_id, :sheet, :film, :cinema, :add_cinema, :city, :bo_date, :bo_time, :bo, :screens, :audition)';


                    $miss = [];
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
                                if (strpos($tpl['template'][1], '=') !== false) {
                                    if (strpos($tpl['template'][1], '$') !== false) {
                                        switch ($tpl['template'][1]) {
                                            case '=$sheet':
                                                $result[$i][$tpl['template'][0]] = $loadedSheetName;
                                                break;
                                            case '=$sender':
                                                $result[$i][$tpl['template'][0]] = $info[':email_from'];
                                                break;
                                            case '=$subject':
                                                $result[$i][$tpl['template'][0]] = $info[':subject'];
                                                break;
                                            case '=$file':
                                                $result[$i][$tpl['template'][0]] = $filename;
                                                break;
                                        }
                                    } else
                                        $result[$i][$tpl['template'][0]] = str_replace('=', '', $tpl['template'][1]);
                                } else
                                    $result[$i][$tpl['template'][0]] = $data[$tpl['template'][2]][$tpl['template'][1]];
                            }
                            if ($tpl['type'] == 's') {
                                if ($result[$i][$tpl['template'][0]] == $tpl['template'][1]) {
                                    //echo $result[$i][$tpl['template'][0]] . "0000\n";
                                    //echo $tpl['template'][1] . "5555\n";
                                    //echo $i . "\n";
                                    //unset($result[$i]);
                                    $miss[] = $i;
                                }
                            }
                        }
                        /*
                        if (!empty($result[$i])) {
                            $result[$i] = $this->formattedData($result[$i], $types);
                            $result[$i]['proc_id'] = $proc_id;
                            //пишем в базу результат
                            $params = $this->getParams($sql, $result[$i]);
                            $params[':email_id'] = $email_id;
                            $params[':attachment_id'] = $attachment_id;
                            $prepare->execute($params);

                        }
                        */
                    }

                    if (!empty($result)) {
                        //print_r($result[0]);
                        if (!empty($miss)) {
                            foreach ($miss as $m) {
                                unset($result[$m]);
                            }
                        }
                        $result = array_values($result);
                        //$is_proc = 0;
                        $sql = $this->createInsertSql($is_proc, $result[0], $types, $table_name, $proc_id, $email_id, $attachment_id);
                        //echo $sql;

                        $ddb->beginTransaction();
                        $prepare = $ddb->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));

                        foreach ($result as $res) {
                            $res = $this->formattedData($res, $types);
                            $res['proc_id'] = $proc_id;
                            //пишем в базу результат
                            $params = $this->getParams($sql, $res);
                            //$params[':email_id'] = $email_id;
                            //$params[':attachment_id'] = $attachment_id;
                            if (array_key_exists(':proc_id', $params)) {
                                $params[':proc_id'] = $proc_id;
                            }
                            if (array_key_exists(':email_id', $params)) {
                                $params[':email_id'] = $email_id;
                            }
                            if (array_key_exists(':attachment_id', $params)) {
                                $params[':attachment_id'] = $attachment_id;
                            }
                            $user = User::findIdentity(Yii::$app->user->id);
                            if (array_key_exists(':company_id', $params)) {
                                $params[':company_id'] = $user->company_id;
                            }
                            //print_r($params);
                            $prepare->execute($params);
                        }
                        //echo $sql;
                        $ddb->commit();
                    }

                } else {
                    //не найден начальный шаблон для файла
                    $errors[] = $loadedSheetName . ' не найден начальный шаблон для файла' . "\n";
                }
                //}
                //print_r($result);
            }
            $time = microtime(true) - $start_script;
            //echo ' - Скрипт выполнялся '.$time.' сек.' . "\t\n";
            /*
            if (!empty($errors)) {
                $out = ['success' => false, 'errors' => implode("\n", $errors)];
            }

            return $out;
            */

        } catch (\Exception $e) {
            //return $e->getMessage();
            return array(
                'error' => $this->function->getErrorStr($e->getMessage())
            );
        }
    }

    protected function createInsertSql($is_proc, $data, $types, $table_name, $proc_id, $email_id, $attachment_id) {
        $result = '';
        $params = $types;
        if ($is_proc == 0) {
            //print_r($data);
            $params = array_intersect_key($types, $data);
        }
        if (array_key_exists('proc_id', $types)) {
            $params['proc_id'] = $proc_id;
        }
        if (array_key_exists('email_id', $types)) {
            $params['email_id'] = $email_id;
        }
        if (array_key_exists('attachment_id', $types)) {
            $params['attachment_id'] = $attachment_id;
        }
        $user = User::findIdentity(Yii::$app->user->id);
        if (array_key_exists('company_id', $types)) {
            $params['company_id'] = $user->company_id;
        }
        if (!empty($params)) {
            $keys = array_keys($params);
            $strFields = implode(',', $keys);
            $arrValues = preg_filter('/^/', ':', $keys);
            $strValues = implode(',', $arrValues);
            if ($is_proc == 1) {
                $result = 'execute procedure ' . $table_name . ' (' . $strValues . ')';
            } elseif ($is_proc == 0) {
                $result = 'insert into ' . $table_name . '(' . $strFields . ') VALUES (' . $strValues . ')';
            }
        }
        return $result;
    }

    public function getData($site, $email_id) {
        try {
            $dev_config = require dirname(__DIR__) . '/config/web_' . $site . '.php';
            Yii::$app->set('datadb', $dev_config['components']['datadb']);
            $sql = 'select bo_email, subject, email_from, email_name, email_date, uid from bo_email where bo_email = :email_id';
            $params = [':email_id' => $email_id];
            $res = $this->selectOne($sql, $params, Yii::$app->datadb);
            if ($res['error'])
                throw new yii\base\ErrorException($res['error']);
            $info = $res['success'];
            if (!empty($info)) {
                $sql = 'select attachment_id, filename, myls_filename from bo_attachments where email_id = :email_id';
                $attach = $this->selectAll($sql, $params, Yii::$app->datadb);
                if ($attach['error'])
                    throw new yii\base\ErrorException($attach['error']);
                $attachments = $attach['success'];

                if (!empty($attachments)) {
                    $this->parseData($email_id, $this->addСolonToKey($attachments), $this->addСolonToKey($info));
                }
            }
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    }

    protected function addСolonToKey($array) {
        $out = [];
        foreach ($array as $key => $value) {
            if (!is_array($value)) {
                $index = ':' . $key;
                $out[$index] = $value;
            } else {
                foreach ($value as $k => $val) {
                    $index = ':' . $k;
                    $out[$key][$index] = $val;
                }
            }
        }
        return $out;
    }

}