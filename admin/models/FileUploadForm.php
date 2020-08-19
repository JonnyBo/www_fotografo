<?php
/**
 * Created by PhpStorm.
 * User: Администратор
 * Date: 26.04.2019
 * Time: 12:25
 */

namespace app\models;


use CKSource\CKFinder\Image;
use yii\base\Model;
use yii\web\UploadedFile;
use Yii;
use yii\imagine\Image as YiiImage;


class FileUploadForm extends Model
{

    public $files;

    public function rules()
    {
        return [
            //[['files'], 'file', 'skipOnEmpty' => false, 'extensions' => ['png', 'jpg', 'gif', 'jpeg', 'svg', 'xls', 'xlsx', 'csv',]],
            [['files'], 'file'],
            //[['exel'], 'file', 'skipOnEmpty' => false, 'extensions' => ['xls', 'xlsx', 'csv']],
        ];
    }

    public function uploadHere($path = '')
    {
        //echo $this->files->extension;
        if ($this->validate()) {
            $filename = md5(time().$this->files->baseName) . '_' . $this->files->baseName . '.' . $this->files->extension;
            //foreach ($this->files as $file) {
            $this->files->saveAs( 'files/' . $path . $filename);
            //}
            return $filename;
        } else {
            return false;
        }
    }

    public function resizeImage($width, $height, $filename, $quality = 80) {
        $image = Yii::getAlias('@webroot/files/images/'.$filename);
        if ($width || $height) {
            YiiImage::resize($image, $width, $height)->save($image, ['quality' => $quality]);
            return $image;
        }
        return false;
    }

    public function thumbImage($width, $height, $filename, $path = '', $prefix = '', $postfix = '', $quality = 80, $crop = false) {
        $image = Yii::getAlias('@webroot/files/images/'.$filename);
        if ($width || $height) {
            //$thumb = $image;
            $thumb = Yii::getAlias('@webroot/files/images/');
            if ($path != '')
                $thumb = $path . '/';
            if ($prefix != '')
                $thumb .= $prefix;
            if ($postfix != '')
                $thumb .= str_replace('.', $postfix.'.', $filename);
            else
                $thumb .= $filename;
            if ($crop) {
                //YiiImage::thumbnail($image, $width, $height)->save($thumb, ['quality' => $quality]);
                YiiImage::getImagine()->open($image)->thumbnail(new \Imagine\Image\Box($width, $height))->save($thumb , ['quality' => $quality]);
            } else
                YiiImage::resize($image, $width, $height)->save($thumb, ['quality' => $quality]);
            return $thumb;
        }
        return false;
    }

    public function uploadFile() {

    }
}