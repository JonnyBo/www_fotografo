<?php

namespace app\modules\allmedia;

use Yii;
use yii\base\BootstrapInterface;

/**
 * allmedia module definition class
 */
class ClientModule extends \yii\base\Module implements BootstrapInterface
{
    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\modules\allmedia\controllers';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        if (\Yii::$app instanceof \yii\console\Application) {
            $this->controllerNamespace = 'app\modules\allmedia\commands';
        }

        // custom initialization code goes here
    }

    public function bootstrap($app)
    {
        if ($app instanceof \yii\console\Application) {
            $this->controllerNamespace = 'app\modules\allmedia\commands';
        }
    }

}
