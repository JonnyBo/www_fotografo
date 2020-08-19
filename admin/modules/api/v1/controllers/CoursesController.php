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
use app\components\SiteFunctions;

class CoursesController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\modules\api\v1\models\Courses';

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
                    'actions' => ['index'],
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
        Yii::$app->response->format = \yii\web\Response:: FORMAT_JSON;
        try {
            $user = User::findIdentity(Yii::$app->user->id);
            if ($user->company_id) {
                $result = [];
                $sql = "select class_id,
                class_name,
                teacher_id,
                level_name,
                class_duration,
                capacity,
                class_start_date,
                class_end_date,
                discipline
                
                from get_api_classes(:company_id)";
                $transaction = Yii::$app->datadb->beginTransaction();
                $courses = Yii::$app->datadb->createCommand($sql)->bindValue(':company_id', $user->company_id)->queryAll();
                $transaction->commit();
                if (!empty($courses)) {
                    foreach ($courses as $course) {
                        $sql = "select client_id,
                        student_start_date,
                        student_end_date
                        from get_api_student_class(:class_id)";
                        $course['students'] = Yii::$app->datadb->createCommand($sql)->bindValue(':class_id', $course['class_id'])->queryAll();
                        $result[] = $course;
                    }
                }
                return $result;
            } else {
                throw new HttpException(404 ,'Не аввторизован пользователь!');
            }
        } catch (\Exception $e) {
            //Yii::$app->errorHandler->logException($e);
            throw new HttpException(404 ,'Ошибка выполнения запроса!');
        }
    }

    public function actionUpdate() {
        return $this->actionIndex();
    }

    public function actionView() {
        return $this->actionIndex();
    }

    public function actionDelete() {
        return $this->actionIndex();
    }

    public function actionDeleteall() {
        return $this->actionIndex();
    }

    public function actionSearch() {
        return $this->actionIndex();
    }

    public function actionCreate()
    {
        return $this->actionIndex();
    }

}
