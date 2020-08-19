<?php

namespace app\modules\boemail\commands;


use Yii;
use yii\console\Controller;
use app\controllers\FunctionController;

use app\controllers\BoemailParser;


/**
 * Default controller for the `allmedia` module
 */
class DefaultController extends Controller
{

    use FunctionController;


    public $site;

    public $email_id;

    public $file;

    public function options($actionID)
    {
        return ['site', 'email_id', 'file'];
    }

    public function optionAliases()
    {
        return ['s' => 'site', 'm' => 'email_id', 'f' => 'file'];
    }


    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionIndex()
    {
        set_time_limit(0);
        $site = 'local';
        if ($this->site)
            $site = $this->site;
        $this->parser = Yii::$app->boemailparser;
        $this->parser->receivingEmails($site);

        //return $this->render('index');
    }

    public function actionGetdata() {
        $site = 'local';
        $email_id = false;
        if ($this->site)
            $site = $this->site;
        if ($this->email_id)
            $email_id = $this->email_id;
        if ($email_id) {
            $this->parser = Yii::$app->boemailparser;
            $this->parser->getData($site, $email_id);
        }
    }

    public function actionTest() {
        $site = 'local';
        if ($this->site)
            $site = $this->site;
        $this->parser = Yii::$app->boemailparser;
        //$this->parser->parseExcelFile(Yii::$app->basePath . '/alltest/YouTube_AllMediaCompanyLLC_Ecommerce_pos_transactional_RU_M_20200501_20200531_v1-1.csv', 0, 0, 'xxx', []);
        $this->parser->parseExcelFile(Yii::$app->basePath . '/web/files/f15dfe889d79b56d35ef99df12f1d4b7_YouTube_AllMediaCompanyLLC_Ecommerce_pos_transactional_RU_M_20200501_20200531_v1-2.csv', 0, 0, 'xxx', []);
    }

}
