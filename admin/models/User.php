<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use yii\db\Connection;
use yii\helpers\Security;

/**
 * User model
 *
 * @property integer $id
 * @property string $name
 * @property string $surname
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $access_token
 * @property string $login
 * @property string $email
 * @property string $phone
 * @property integer $company_id
 * @property integer $client_id
 * @property string $auth_key
 * @property string $email_confirm_token
 * @property string $password write-only password
 * @property integer $is_super_admin
 */
class User extends ActiveRecord implements IdentityInterface
{
    const STATUS_DELETED = 0;
    const STATUS_ACTIVE = 10;
    const STATUS_REGISTER = 1;
    const STATUS_WAIT = 5;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'users';
    }

    public static function getDb(){
        return \Yii::$app->db;
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            //['status', 'default', 'value' => self::STATUS_ACTIVE],
            //['status', 'in', 'range' => [self::STATUS_ACTIVE, self::STATUS_DELETED]],
            ['status', 'in', 'range' => [self::STATUS_DELETED, self::STATUS_WAIT, self::STATUS_ACTIVE, self::STATUS_REGISTER]],
            [['login', 'email', 'is_super_admin'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return static::findOne(['user_id' => $id]);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        if ($user = static::findOne(['access_token' => $token])) {
            if ($user->isAccessTokenValid($user))
                return $user;
            else
                throw new \yii\web\NotFoundHttpException('Token expired');
        }
        throw new \yii\web\NotFoundHttpException('Incorrect Token');
    }

    public function loginAuth() {
        $post = Yii::$app->request->post();
        $model = User::findOne(["login" => $post["username"]]);
        if (empty($model)) {
            throw new \yii\web\NotFoundHttpException('User not found');
        }
        if ($model->validatePassword($post["password"])) {
            //пишем токен и время его жизни

            $model->access_token = urlencode(Yii::$app->getSecurity()->encryptByKey($model->generateAccessToken(Yii::$app->params['tokenLifeTime'], $model->company_id, $model->id), Yii::$app->components['request']['cookieValidationKey']));
            $model->save();
            return $model; //return whole user model including auth_key or you can just return $model["auth_key"];
        } else {
            throw new \yii\web\NotFoundHttpException('Incorrect Password');
        }
    }

    public function generateAccessToken($expireInSeconds, $company_id, $user_id)
    {
        return $user_id . '_' . strtotime("+ 100 years")  . '_' . $company_id;
    }

    public function isAccessTokenValid($user)
    {
        if (!empty($this->access_token)) {
            $this->access_token = Yii::$app->getSecurity()->decryptByKey(urldecode($this->access_token), Yii::$app->components['request']['cookieValidationKey']);
            $arrToken = explode('_', $this->access_token);
            //Yii::info($arrToken, 'dev_log');
            if (count($arrToken) != 3) {
                throw new \yii\web\NotFoundHttpException('Token incorrect');
            }
            $user_id = (int) $arrToken[0];
            $timestamp = (int) $arrToken[1];
            $company_id = (int) $arrToken[2];
            if ($timestamp <= time()) {
                throw new \yii\web\NotFoundHttpException('Token expired');
            }
            if ($company_id != $user->company_id) {
                throw new \yii\web\NotFoundHttpException('Token company incorrect');
            }
            if ($user_id != $user->id) {
                throw new \yii\web\NotFoundHttpException('Token user incorrect');
            }
            if (!$user->api) {
                throw new \yii\web\NotFoundHttpException('Token api access denied');
            }
            return true;
        }
        return false;
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        try{
            //if (\Yii::$app->db->getTableSchema('{{%table_name}}', true) !== null) {
                // работа с таблицей
                if ($user = static::findOne(['login' => strtolower($username)])) {
                    return $user;
                }
            /*} else {
                Yii::$app->session->setFlash('error', 'Нет таблицы');
                return false;
            }*/
        } catch (\Exception $e) {
            Yii::$app->session->setFlash('error', $e->getMessage());
            //return $this->goHome();
        }
        //return static::findOne(['user_login' => $username]);
    }

    public static function findByEmail($email)
    {
        return static::findOne(['login' => strtolower($email)]);
    }

    public function getActive($user_id) {
        $result = false;
        if ($user = self::findIdentity($user_id))  {
            if ($user->is_active == 1)
                $result = true;
        }
        return $result;
    }

    public function isSuperAdmin($user_id) {
        $result = false;
        if ($user = self::findIdentity($user_id))  {
            if ($user->is_super_admin == 1)
                $result = true;
        }
        return $result;
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @param string $auth_key
     */
    public function setAuthKey($auth_key)
    {
        $this->auth_key = $auth_key;
    }

    public function getLogin($id) {
        return User::find()->select(['login'])->where(['user_id' => $id])->one()->login;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    //ВОССТАНОВЛЕНИЕ ПАРОЛЯ

    public static function findByPasswordResetToken($token)
    {

        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne([
            'password_reset_token' => $token,
            'status' => self::STATUS_ACTIVE,
        ]);
    }

    public static function isPasswordResetTokenValid($token)
    {

        if (empty($token)) {
            return false;
        }

        $timestamp = (int) substr($token, strrpos($token, '_') + 1);
        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        return $timestamp + $expire >= time();
    }

    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }

    public function sendNotification($text)
    {
        $email = $this->login;
        $sent = Yii::$app->mailer
            ->compose(
                ['html' => 'user-notification-html'],
                ['message' => $text])
            ->setTo($email)
            //->setFrom(Yii::$app->params['adminEmail'])
            ->setSubject('New notification')
            ->send();
        if (!$sent) {
            throw new \RuntimeException('Sending error.');
        }
    }
/*
    public static function findIdentityByAccessToken($token, $type = NULL)
    {
        // find user with token
        if ($user = static::findOne(['access_token' => $token])) {
            return $user->isAccessTokenValid() ? $user : null;
        }
        return null;
    }

    public function generateAccessToken($expireInSeconds)
    {
        $this->access_token = Yii::$app->security->generateRandomString() . '_' . (time() + $expireInSeconds);
    }

    public function isAccessTokenValid()
    {
        if (!empty($this->access_token)) {
            $timestamp = (int) substr($this->access_token, strrpos($this->access_token, '_') + 1);
            return $timestamp > time();
        }
        return false;
    }
*/
}