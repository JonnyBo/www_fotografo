<?php

namespace app\controllers;

use app\models\User;
use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;
use yii\web\HttpException;
use yii\base\ErrorException;

class AdminController extends Controller
{

    use FunctionController;

    public $layout;

    public $formSQLs = array();

    public function init()
    {
        $domain = current(explode('.', Yii::$app->getRequest()->serverName, 2));
        if ($domain !== 'myls') {
            $this->getStartData();
            $this->layout = 'constructor';
        }

    }

    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {

        return [

            'access' => [
                'class' => AccessControl::className(),
                'only' => ['index'],
                'rules' => [
                    [
                        'actions' => ['index'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],


            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['get', 'post'],
                ],
            ],
        ];

    }

    public function actionIndex()
    {

        if (!Yii::$app->user->isGuest) {
            $this->layout = 'constructor';

            return $this->render('index');
        } else {
            return $this->redirect('login');
        }
        //return $this->render('index');
    }

    private function getStartData() {
        $sql = "select s.selectsql from tables t inner join selects s on s.sql_id = t.sql_id where t.name = 'FORMS'";
        //$this->formSQLs = Yii::$app->db->createCommand($sql, [])->queryOne();
        $this->formSQLs = $this->selectOne($sql, [], Yii::$app->db)['success'];
    }

    public function actionGetallforms() {
        $result = [];
        if ($this->formSQLs['selectsql']) {
            //$result = Yii::$app->db->createCommand($this->formSQLs['selectsql'], [])->queryAll();
            $result = $this->selectAll($this->formSQLs['selectsql'], [], Yii::$app->db)['success'];
        }
        return json_encode($result);
    }

}
