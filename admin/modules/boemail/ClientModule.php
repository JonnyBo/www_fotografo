<?php

namespace app\modules\boemail;

use Yii;
use yii\base\BootstrapInterface;

/**
 * email module definition class
 */
class ClientModule extends \yii\base\Module implements BootstrapInterface
{

    public $parser;

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\modules\boemail\controllers';
    //public $controllerNamespace = 'app\modules\boemail\commands';

    /**
     * {@inheritdoc}
     */
    public function init()
    {
        parent::init();

        //$this->parser = Yii::createObject($this->components['parser']);

        // custom initialization code goes here
    }

    public function bootstrap($app)
    {
        if ($app instanceof \yii\console\Application) {
            $this->controllerNamespace = 'app\modules\boemail\commands';
        }
    }

}
