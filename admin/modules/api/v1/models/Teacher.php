<?php

namespace app\modules\api\v1\models;

use Yii;

class Teacher extends \yii\db\ActiveRecord
{

    /**
     * @return \yii\db\Connection the database connection used by this AR class.
     */
    public static function getDb()
    {
        return Yii::$app->get('datadb');
    }

}
