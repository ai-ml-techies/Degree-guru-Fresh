<?php

declare(strict_types=1);

namespace app\assets;

use yii\web\AssetBundle;
use yii\web\View;
use yii\web\YiiAsset;

class AppAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public $css = [

        // AdminLTE CSS
        'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css',

        // Shared design system (must come after AdminLTE so overrides apply)
        'css/admin.css',

        // Optional custom CSS
        'css/site.css',
    ];

    public $js = [

        // jQuery
        'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',

        // Bootstrap Bundle
        'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',

        // AdminLTE JS
        'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js',

        // Existing JS
        'js/color-mode.js',
    ];

    public $jsOptions = [
        'position' => View::POS_END,
    ];

    public $depends = [
        YiiAsset::class,
    ];
}