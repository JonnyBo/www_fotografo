<?php

namespace app\modules\boemail\controllers;

use League\Flysystem\Exception;
use PDO;
use yii\web\Controller;
use Yii;
use app\controllers\FunctionController;
use app\controllers\BoemailParser;

/**
 * Default controller for the `email` module
 */
class BoemailController extends Controller
{

    use FunctionController;

    /**
     * Renders the index view for the module
     * @return string
     */

    public function actionIndex($site = false)
    {
        set_time_limit(0);

        if ($site == false)
            $site = 'local';
        $this->parser = Yii::$app->boemailparser;
        $this->parser->receivingEmails($site);

    }

    public function actionGetdata($email_id, $site = false) {

        if ($site == false)
            $site = 'local';

        if ($email_id) {
            $this->parser = Yii::$app->boemailparser;
            $this->parser->getData($site, $email_id);
        }

    }

    public function actionParsefile($fileaddr) {
        try {
            $fileaddr = Yii::$app->basePath . '/web/files/' . $fileaddr;
            $this->parser = Yii::$app->boemailparser;
            // проверить не архив ли этот файл
            $whitelist = ['zip'];
            $ext = array_pop(explode(".", $fileaddr));
            if (in_array($ext, $whitelist)) {
                $zip = new \ZipArchive;
                $path = Yii::$app->basePath . '/web/files/archive';
                if (!file_exists($path))
                    mkdir($path, 0777);
                if ($zip->open($fileaddr) === TRUE) {
                    $zip->extractTo($path);
                    $zip->close();
                    $dir = opendir( $path );
                    $dataFiles = [];
                    while ( $file = readdir( $dir ) ) {
                        if ( $file <> "." && $file <> ".." ) {
                            if (preg_match( "/.csv$|.xls$|.xlsx$/i", $file )) {
                                $dataFiles[] = $file;
                            }
                        }
                    }
                    closedir( $dir );
                    //sort( $afiles );
                    reset( $afiles );
                    if (!empty($dataFiles)) {
                        foreach ($dataFiles as $dataFile) {
                            $this->parser->parseExcelFile($path . '/' . $dataFile);
                        }
                        //удаляем все из папки archive

                        foreach (glob($path . '/*') as $file)
                            unlink($file);
                    }
                } else {
                    return array(
                        'error' => 'Не получилось извлечь файлы из архива'
                    );
                }
            } else {
                $this->parser->parseExcelFile($fileaddr);
            }

            return json_decode(['success' => true]);

        } catch (\Exception $e) {
            return array(
                'error' => $this->getErrorStr($e->getMessage())
            );
        }
    }

}
