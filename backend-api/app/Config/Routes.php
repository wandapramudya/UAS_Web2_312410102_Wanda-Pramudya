<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
    require SYSTEMPATH . 'Config/Routes.php';
}

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

/*
 * --------------------------------------------------------------------
 * ROUTE DEFINITIONS
 * --------------------------------------------------------------------
 */

// ==================== HOME ====================
$routes->get('/', 'Home::index');

// ==================== AUTH ====================
$routes->post('auth/login', 'AuthController::login');
$routes->post('auth/register', 'AuthController::register');

// ==================== CRUD KATEGORI ====================
$routes->get('api/kategori', 'KategoriController::index');
$routes->get('api/kategori/(:num)', 'KategoriController::show/$1');
$routes->post('api/kategori', 'KategoriController::create');
$routes->put('api/kategori/(:num)', 'KategoriController::update/$1');
$routes->delete('api/kategori/(:num)', 'KategoriController::delete/$1');

// ==================== CRUD SUPPLIER ====================
$routes->get('api/supplier', 'SupplierController::index');
$routes->get('api/supplier/(:num)', 'SupplierController::show/$1');
$routes->post('api/supplier', 'SupplierController::create');
$routes->put('api/supplier/(:num)', 'SupplierController::update/$1');
$routes->delete('api/supplier/(:num)', 'SupplierController::delete/$1');

// ==================== CRUD BARANG ====================
$routes->get('api/barang', 'BarangController::index');
$routes->get('api/barang/search', 'BarangController::search');
$routes->get('api/barang/(:num)', 'BarangController::show/$1');
$routes->post('api/barang', 'BarangController::create');
$routes->put('api/barang/(:num)', 'BarangController::update/$1');
$routes->delete('api/barang/(:num)', 'BarangController::delete/$1');

// ==================== TEST ====================
$routes->get('testdb', 'TestDb::index');

if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
    require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}