<?php
namespace app\modules\api\v1\controllers;

use app\models\User;
use yii;
use yii\filters\AccessControl;
use yii\rest\Controller;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;
use yii\filters\VerbFilter;
use yii\web\HttpException;

class LeadController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\modules\api\v1\models\Lead';

    public function behaviors() {
        $behaviors = parent::behaviors();
        $behaviors['authenticator'] = [
            'class' => CompositeAuth::className(),
            'authMethods' => [
                HttpBasicAuth::className(),
                HttpBearerAuth::className(),
                QueryParamAuth::className(),
            ],
        ];
        $behaviors['authenticator']['only'] = ['index', 'create'];

        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['init'],
            'rules' => [
                [
                    'actions' => ['init'],
                    'allow' => true,
                    'roles' => ['?'],
                ],
                [
                    'actions' => ['create'],
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ];

        $behaviors['verbs'] = [
            'class' => VerbFilter::className(),
            'actions' => [
                'init' => ['post'],
                'index' => ['get'],
                'view' => ['get'],
                'create' => ['post'],
                'update' => ['PUT'],
                'delete' => ['delete'],
                'deleteall' => ['post'],
                'search' => ['get']
            ],
        ];

        return $behaviors;
    }
/*
    public function actionInit() {
        if ($model = User::loginAuth()) {
            return ['token' => $model->access_token];
        }
        throw new \yii\web\NotFoundHttpException('User not found');
    }
*/
    public function actions(){

        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['index']);
        unset($actions['update']);
        unset($actions['view']);
        unset($actions['delete']);
        unset($actions['deleteall']);
        unset($actions['search']);
        return $actions;
    }

    public function actionIndex() {
        return $this->actionCreate();
    }

    public function actionUpdate() {
        return $this->actionCreate();
    }

    public function actionView() {
        return $this->actionCreate();
    }

    public function actionDelete() {
        return $this->actionCreate();
    }

    public function actionDeleteall() {
        return $this->actionCreate();
    }

    public function actionSearch() {
        return $this->actionCreate();
    }

    public function actionCreate()
    {
        Yii::$app->response->format = \yii\web\Response:: FORMAT_JSON;
        if (Yii::$app->request->post()) {
            $field1 = Yii::$app->request->post('field1', false);
            $field2 = Yii::$app->request->post('field2', false);
            $client = new $this->modelClass;
            if ($client->load(Yii::$app->request->post(), '')) {
                if ($client->name && $client->surname && $client->mobile_phone && $client->email) {
                    if ($field1 || $field2) {
                        $client->comment = trim($field1 . ' ' . $field2);
                    }
                    $client->sys_client_type_id = 3;
                    if ($client->save()) {
                        //print_r($client);
                        return $client->attributes;
                        //echo 'Сохранено!';
                    }
                } else {
                    throw new HttpException(404 ,'Не переданы обязательные поля!');
                }
            }
        }
        throw new HttpException(404 ,'Не переданы никакие параметры!');
    }

}