<?php

namespace app\modules\allmedia\controllers;

use PDO;
use yii\web\Controller;
use Yii;
use app\controllers\FunctionController;
use app\controllers\BoemailParser;

/**
 * Default controller for the `email` module
 */
class DefaultController extends Controller
{

    use FunctionController;

    /**
     * Renders the index view for the module
     * @return string
     */

    public function actionIndex($site = false)
    {
        set_time_limit(0);

        $file = Yii::$app->basePath . '/alltest/YouTube_AllMediaCompanyLLC_Ecommerce_pos_transactional_RU_M_20200501_20200531_v1-1.csv';

        $this->parser = Yii::$app->boemailparser;
        $this->parser->parseExcelFile($file);

    }

}
