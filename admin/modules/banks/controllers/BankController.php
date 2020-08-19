<?php

namespace app\modules\banks\controllers;

use Yii;
use app\controllers\FunctionController;
use yii\web\Controller;
use app\modules\banks\models\Document;


/**
 * Default controller for the `client` module
 */
class BankController extends Controller
{
    /**
     * Renders the index view for the module
     * @return string
     */

    use FunctionController;

    protected $documents;

    public function actionIndex($fileaddr)
    {
        $this->function = Yii::$app->sitefunctions;
        $fileaddr = Yii::getAlias('@webroot/files/' . $fileaddr);
        $maas = file($fileaddr); // Открываем файл как массив строк
        $documents = []; // Создаем пустой массив для хранения документов
        $docid = 0; // Устанавливаем счетчик ID документа на 0
        foreach ($maas as $key => $value) { //Начинаем парсить каждую строку
            $value2 = rtrim($value); // Тримируем правую сторону строки от управляющих символов
            $value2 = mb_convert_encoding($value2, "utf-8", "windows-1251"); // Конвертируем значение в utf-8 так как изначальная кодировка файла windows-1251
            $result = explode('=', $value2); // Разбиваем строку на Ключ => Значение
            if (count($result) == 2) { // Проверяем прошла ли разбивка
                if ($result[0] == 'СекцияДокумент') { //Если разбивка прошла и ключ результата СекцияДокумент то
                    $workflow = new Document(); //Создаем новый Объект
                }
                if (isset($workflow)) { //Если объект создан то
                    $workflow->set($result[0], $result[1]); // Назначаем Свойство, Содержимое
                }
            } else { //Если разбивка не прошла
                if ($result[0] == 'КонецДокумента') { //То проверяем конец ли это документа
                    $documents[$docid] = $workflow; //Добавляем в массив документов новый документ
                    $docid++; //Плюсуем счетчик
                }
            }
        }
        $this->documents = $documents; // Передаем массив документов в Свойство класса

        $out = [];
        $i = 0;
        foreach ($this->documents as $doc) {
            if ($doc->doctype == 'Платежное поручение') {
                $out[$i]['inbankid'] = $doc->inbankid;
                $out[$i]['docdate'] = $doc->docdate;
                $out[$i]['summ'] = $doc->summ;
                $out[$i]['indate'] = $doc->indate;
                $out[$i]['payer'] = $doc->payer;
                $out[$i]['payerinn'] = $doc->payerinn;
                $out[$i]['paydirection'] = $doc->paydirection;
                $i++;
            }
        }
        if (!empty($out)) {
            $sql = 'execute procedure load_payments(:payment_sum, :payment_date, :payment_number, :client_name, :inn, :description, :load_id)';
            foreach ($out as $dd) {
                $ddate = ($dd['docdate']) ? $dd['docdate'] : $dd['indate'];
                $params = [
                    ':payment_sum' => $dd['summ'],
                    ':payment_date' => $ddate,
                    ':payment_number' => $dd['inbankid'],
                    ':client_name' => $dd['payer'],
                    ':inn' => $dd['payerinn'],
                    ':description' => $dd['paydirection'],
                    ':load_id' => null,
                ];
                $this->executeSQL($sql, $params, Yii::$app->datadb);
            }
            /* execute procedure load_payments(:payment_sum, :payment_date, :payment_number, :client_name, :inn, :description, :load_id); */

        }
        //удаляем файл
        @unlink($fileaddr);
        //print_r($out);
        return json_encode(array(
            'success' => true,
        ));
    }
}
