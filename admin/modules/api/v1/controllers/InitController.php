<?php

namespace app\modules\api\v1\controllers;

use app\models\User;
use yii;
use yii\filters\AccessControl;
use yii\rest\Controller;

/**
 * Default controller for the `api` module
 */
class InitController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\models\User';

    public function behaviors() {

        $behaviors = parent::behaviors();
        /*
        $behaviors['authenticator'] = [
            'class' => CompositeAuth::className(),
            'authMethods' => [
                HttpBasicAuth::className(),
                HttpBearerAuth::className(),
                QueryParamAuth::className(),
            ],
        ];
        $behaviors['authenticator']['only'] = ['index', 'create'];
        */
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
                    'actions' => ['create', 'index', 'view', 'update', 'delete', 'deleteall', 'search'],
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ];
        return $behaviors;
    }

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

    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionIndex() {
        return $this->actionInit();
    }

    public function actionCreate() {
        return $this->actionInit();
    }

    public function actionUpdate() {
        return $this->actionInit();
    }

    public function actionView() {
        return $this->actionInit();
    }

    public function actionDelete() {
        return $this->actionInit();
    }

    public function actionDeleteall() {
        return $this->actionInit();
    }

    public function actionSearch() {
        return $this->actionInit();
    }

    public function actionInit() {
        if ($model = User::loginAuth()) {
            return ['token' => $model->access_token];
        }
        throw new \yii\web\NotFoundHttpException(401, 'User not found');
    }
}
