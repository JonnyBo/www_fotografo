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

class ClassesController extends \yii\rest\ActiveController
{

    public $modelClass = 'app\modules\api\v1\models\Classes';

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
                'index' => ['get', 'post'],
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
        $student_id = Yii::$app->request->post('student_id', false);
        $teacher_id = Yii::$app->request->post('teacher_id', false);
        $class_id = Yii::$app->request->post('class_id', false);
        try {
            $user = User::findIdentity(Yii::$app->user->id);
            if ($user->company_id) {
                $result = [];
                $sql = "select event_id,
                out_class_id,
                out_teacher_id,
                event_start_date,
                event_end_date,
                description,
                client_id
                from get_api_events(:companyid, :student_id, :teacher_id, :class_id)";
                $params = [':companyid' => $user->company_id, ':student_id' => null, ':teacher_id' => null, ':class_id' => null];
                if ($student_id)
                    $params[':student_id'] = $student_id;
                if ($teacher_id)
                    $params[':teacher_id'] = $teacher_id;
                if ($class_id)
                    $params[':class_id'] = $class_id;
                $transaction = Yii::$app->datadb->beginTransaction();
                $classes = Yii::$app->datadb->createCommand($sql, $params)->queryAll();
                $transaction->commit();
                //Yii::info($classes, 'dev_log');
                if (!$student_id) {
                    foreach ($classes as $class) {
                        $sql = "select client_id
                        from get_api_event_per_students(:event_id)";
                        $class['students'] = Yii::$app->datadb->createCommand($sql)->bindValue(':event_id', $class['event_id'])->queryAll();
                        //Yii::info($class, 'dev_log');
                        $result[] = $class;
                    }
                } else {
                    $result = $classes;
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
