<?php

namespace app\modules\api\v1\controllers;

use yii;
use yii\rest\Controller;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\auth\QueryParamAuth;

class UserController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\models\User';

    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionLogin()
    {
        $post = Yii::$app->request->post();
        $model = User::findOne(["user_login" => $post["email"]]);
        if (empty($model)) {
            throw new \yii\web\NotFoundHttpException('User not found');
        }
        if ($model->validatePassword($post["password"])) {
            //$model->last_login = Yii::$app->formatter->asTimestamp(date_create());
            //$model->save(false);
            return $model; //return whole user model including auth_key or you can just return $model["auth_key"];
        } else {
            throw new \yii\web\ForbiddenHttpException();
        }
    }

}
