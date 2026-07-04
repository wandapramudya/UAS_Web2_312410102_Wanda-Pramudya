<?php

namespace App\Controllers;

use App\Models\BarangModel;

class TestDb extends BaseController
{
    public function index()
    {
        $model = new BarangModel();
        $data = $model->getBarangLengkap();
        
        echo "<h1>Test Database</h1>";
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }
}