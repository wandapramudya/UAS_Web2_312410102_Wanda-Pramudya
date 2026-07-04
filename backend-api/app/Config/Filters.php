<?php

namespace Config;

use CodeIgniter\Config\Filters as BaseFilters;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\ForceHTTPS;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\PageCache;
use CodeIgniter\Filters\PerformanceMetrics;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseFilters
{
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'forcehttps'    => ForceHTTPS::class,
        'pagecache'     => PageCache::class,
        'performance'   => PerformanceMetrics::class,
        'cors'          => \App\Filters\CORS::class,
        'auth'          => \App\Filters\AuthFilter::class,
    ];

    public array $required = [
        'before' => [
            'forcehttps',
            'pagecache',
        ],
        'after' => [
            'pagecache',
            'performance',
            'toolbar',
        ],
    ];

    public array $globals = [
        'before' => [
            'cors',
        ],
        'after' => [
            'toolbar',
        ],
    ];

    public array $methods = [];
    
    // ============================================
    // FILTER AUTH - HANYA UNTUK API
    // ============================================
    public array $filters = [
        //'auth' => [
        //    'before' => [
        //        'api/barang',       // GET /api/barang
        //        'api/barang/*',     // GET /api/barang/1, PUT, DELETE
        //        'api/kategori',     // GET /api/kategori
        //        'api/kategori/*',   // GET /api/kategori/1, PUT, DELETE
        //        'api/supplier',     // GET /api/supplier
        //        'api/supplier/*',   // GET /api/supplier/1, PUT, DELETE
        //   ],
        //],
    ];
}