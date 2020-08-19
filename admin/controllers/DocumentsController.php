<?php
/**
 * Created by PhpStorm.
 * User: Администратор
 * Date: 31.03.2019
 * Time: 20:36
 */

namespace app\controllers;


use app\models\FileUploadForm;
use yii\web\UploadedFile;
use yii;


class DocumentsController extends FrameController
{

    public function actionFileupload(/*$table, */ $params = false, $field = 'documentFiles')
    {
        $mustLogout = $this->mustLogout();
        if ($mustLogout)
            return $mustLogout;
        $uploadParams = [];
        $path = '';
        if ($params) {
            $param = json_decode($params, true);
            $uploadParams = $this->parseParams($param);
            $path = 'images/';
        }

        //print_r($uploadParams);

        $model = new FileUploadForm();
        if (Yii::$app->request->isPost) {

            $model->files = UploadedFile::getInstanceByName($field);
            $baseFilename = $model->files->basename . '.' . $model->files->extension;
            if ($filename = $model->uploadHere($path)) {
                // your code here

                if (!empty($uploadParams)) {
                    if ($uploadParams['resize']) {
                        if (!$model->resizeImage($uploadParams['resize']['width'], $uploadParams['resize']['height'], $filename, $uploadParams['resize']['quality'])) {
                            throw new \Exception('Не выполнен ресайз картинки');
                        }
                    }
                    if (!empty($uploadParams['preview'])) {
                        foreach ($uploadParams['preview'] as $preview) {
                            $outPath = '';
                            if ($preview['path'] && is_array($preview['path'])) {
                                $outPath = Yii::getAlias('@webroot/files/images/') . implode('/', $preview['path']);
                                mkdir($outPath, 0777, true);
                            }
                            if (!$model->thumbImage($preview['width'], $preview['height'], $filename, $outPath, $preview['prefix'], $preview['postfix'], $preview['quality'], $preview['crop'])) {
                                throw new \Exception('Не выполнено сохранение превыью картинки');
                            }
                        }
                    }

                }
                return json_encode($path . $filename);
            }
        }
        return json_encode('error');
    }

    protected function getImageParams($params)
    {
        $result = [];
        foreach ($params as $item) {
            if (strpos($item, 'w=') !== false) {
                $result['width'] = intval(str_replace('w=', '', $item));
            }
            if (strpos($item, 'h=') !== false) {
                $result['height'] = intval(str_replace('h=', '', $item));
            }
            if (strpos($item, 'n=') !== false) {
                $str = trim(str_replace('n=', '', $item));
                if (strpos($str, '*') !== false) {
                    $arrPath = explode('/', $str);
                    $last = array_pop($arrPath);
                    if (!empty($arrPath))
                        $result['path'] = $arrPath;
                    if (strpos($last, '*') !== false) {
                        $fn = explode('*', $last);
                        if ($fn[0] != '')
                            $result['prefix'] = $fn[0];
                        if ($fn[1] != '')
                            $result['postfix'] = $fn[1];
                    }
                } else
                    $result['postfix'] = trim(str_replace('n=', '', $item));
            }
            if (strpos($item, 'q=') !== false) {
                $result['quality'] = intval(str_replace('q=', '', $item));
            }
            if ($item == 'crop') {
                $result['crop'] = true;
            }
        }
        return $result;
    }

    protected function parseParams($param)
    {
        $result = [];
        if (!empty($param)) {
            foreach ($param as $pp) {
                if (is_array($pp)) {
                    foreach ($pp as $key => $p) {
                        if ($key == 'preview' && is_array($p)) {
                            $result['preview'][] = $this->getImageParams($p);
                        }
                        if ($key == 'resize' && is_array($p)) {
                            $result['resize'] = $this->getImageParams($p);
                        }
                    }
                }
            }
        }
        return $result;
    }

}