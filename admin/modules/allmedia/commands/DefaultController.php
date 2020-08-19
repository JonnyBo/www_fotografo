<?php

namespace app\modules\allmedia\commands;

use app\controllers\FunctionController;
use Yii;
use yii\console\Controller;


/**
 * Default controller for the `allmedia` module
 */
class DefaultController extends Controller
{

    use FunctionController;

    public $type;

    public function options($actionID)
    {
        return ['type'];
    }

    public function optionAliases()
    {
        return ['t' => 'type'];
    }


    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionIndex()
    {
        $type = 'Daily';
        if ($this->type)
            $type = $this->type;
        $dev_config = require dirname(dirname(dirname(__DIR__))) . '/config/web_allmedia.php';
        Yii::$app->set('db', $dev_config['components']['db']);
        Yii::$app->set('datadb', $dev_config['components']['datadb']);
        $this->function = Yii::$app->sitefunctions;
        //exit();
        $sql = "select coalesce(max(t.start_date) + 1, '2018-09-02') start_date from transactions t";
        $date = $this->selectOne($sql, [], Yii::$app->datadb)['success']['start_date'];
        $this->saveAllmediastat($date, $type);
        //$this->getAllmediaParse();
    }

    protected function extractGZ($file, $path) {
        $buffer_size = 4096;
        $out_file_name = str_replace('.gz', '', $file);
        $file = gzopen($path . '/' . $file, 'rb');
        $out_file = fopen($path . '/' . $out_file_name, 'wb');
        while (!gzeof($file)) {
            fwrite($out_file, gzread($file, $buffer_size));
        }
        fclose($out_file);
        gzclose($file);
        return $out_file_name;
    }

    protected function getAllmediaParse() {
        $path = Yii::$app->basePath . '/alltest';
        //echo dirname(dirname(dirname(__DIR__))) . '/config/web_local.php';
        //exit();
        $dev_config = require dirname(dirname(dirname(__DIR__))) . '/config/web_allmedia.php';
        //Yii::$app->set('db', $dev_config['components']['db']);
        //Yii::$app->set('datadb', $dev_config['components']['datadb']);
        $this->function = Yii::$app->sitefunctions;
        $dir = opendir( $path );
        $files = array();
        while ( $file = readdir( $dir ) ) {
            if ( $file <> "." && $file <> ".." ) {
                if ( preg_match( "/^D_(.*).gz/i", $file ) ) {
                    $afiles[] = $file;
                }
            }
        }
        closedir( $dir );
        //sort( $afiles );
        if (!empty($afiles)) {
            reset( $afiles );
            //разархивируем и разбираем файл
            include_once (Yii::$app->basePath . '/components/parsecsv/parsecsv.lib.php');
            $csv = new \ParseCsv\Csv();
            foreach ($afiles as $key => $afile) {
                //if ($key < 1) {
                echo $afile . "\t\n";
                $txtFile = $this->extractGZ($afile, $path);
                $csv->auto($path . '/' . $txtFile);
                if (!empty($csv->data)) {
                    //print_r($csv->data);
                    $start_script = microtime(true);
                    for ($j = 0; $j < count($csv->data); $j++) {
                        $item = $csv->data[$j];
                        $param = [':film_name' => $item['Title'], ':format_type' => $item['Asset/Content Flavor'], ':cost' => $item['Royalty Price'], ':cur' => $item['Royalty Currency']];
                        if ($item['PreOrder'] && $item['PreOrder'] == 'P') {
                            $param[':transaction_type'] = 'Предзаказ';
                        } elseif ($item['Product Type Identifier'] && $item['Product Type Identifier'] == 'D') {
                            $param[':transaction_type'] = 'Прокат';
                        } elseif ($item['Sale/Return'] && $item['Sale/Return'] == 'S') {
                            $param[':transaction_type'] = 'Покупка';
                        } elseif ($item['Sale/Return'] && $item['Sale/Return'] == 'R') {
                            $param[':transaction_type'] = 'Возврат';
                        }
                        $param[':start_date'] = date('Y-m-d', strtotime($item['Download Date (PST)']));
                        $sql = 'execute procedure import_transaction (:film_name, 1, :format_type, :transaction_type, :start_date, :cost, :cur)';
                        //$start_script = microtime(true);
                        //print_r($param);
                        $this->executeSQL($sql, $param, Yii::$app->datadb);
                        //$time = microtime(true) - $start_script;
                        //echo $j . ' - Скрипт выполнялся '.$time.' сек.' . "\t\n";
                        //print_r($param);
                        //updateFields ($collection, $item);
                    }
                    echo 'Разобран файл ' . $txtFile;
                    $time = microtime(true) - $start_script;
                    echo ' - Скрипт выполнялся '.$time.' сек.' . "\t\n";
                } else {
                    //не удалось разобрать csv файл - копируем его в корзину
                    echo 'Не удалось разобрать файл ' . $txtFile . "\t\n";
                }
                //удаляем файл из загрузок
                @unlink($path . '/' . $txtFile);
                @unlink($path . '/' . $afile);
                //}
            }
        }
    }

    protected function saveAllmediastat($dateStart, $type = 'Daily') {
        $command = 'cd /var/www/docent/data/www/myls.events/alltest && java -jar Reporter.jar p=Reporter.properties m=Robot.XML Sales.getVendors';
        $vendorsXML = shell_exec($command);
        $xml = simplexml_load_string($vendorsXML);
        if (!empty($xml->Vendor)) {
            date_default_timezone_set('Europe/Moscow');
            $dateCurrent = new \DateTime('now');
            //$dateStart = '2018-09-02';
            $days = 1;
            if ($type == 'Weekly')
                $days = 7;
            foreach ($xml->Vendor as $vendor) {
                //echo $vendor . "\t\n";
                $date = new \DateTime($dateStart);
                //$command = 'cd allmedia && java -jar Reporter.jar p=Reporter.properties Sales.getReport '.$vendor.', Sales, Detailed, '.$type.', '.$date->format('Ymd').', 1_2';
                //shell_exec($command);
                //$command = 'cd allmedia && java -jar Reporter.jar p=Reporter.properties Sales.getReport '.$vendor.', Pre-Order, Detailed, Weekly, '.$date->format('Ymd').', 1_2';
                //shell_exec($command);
                do {

                    $command = 'cd /var/www/docent/data/www/myls.events/alltest && java -jar Reporter.jar p=Reporter.properties Sales.getReport '.$vendor.', Sales, Detailed, '.$type.', '.$date->format('Ymd').', 1_2';
                    //echo $command . "\n";
                    shell_exec($command);
                    $date = $date->add(new \DateInterval('P'.$days.'D'));
                    //$command = 'cd allmedia && java -jar Reporter.jar p=Reporter.properties Sales.getReport '.$vendor.', Pre-Order, Detailed, Weekly, '.$date->format('Ymd').', 1_2';
                    //shell_exec($command);
                } while ($date < $dateCurrent);
            }
            $this->getAllmediaParse();
        }
    }

}
