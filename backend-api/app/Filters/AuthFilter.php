<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // ============================================
        // 1. IZINKAN OPTIONS REQUEST (preflight CORS)
        // ============================================
        if ($request->getMethod() === 'options') {
            return;
        }

        // ============================================
        // 2. ENDPOINT YANG TIDAK PERLU TOKEN
        // ============================================
        $allowedRoutes = ['auth/login', 'auth/register'];
        
        // Ambil URI path tanpa base URL
        $uri = $request->getUri();
        $currentPath = $uri->getPath();
        
        // Hapus "index.php/" jika ada
        $currentPath = str_replace('index.php/', '', $currentPath);
        
        // Jika path termasuk yang diizinkan, skip
        foreach ($allowedRoutes as $route) {
            if (strpos($currentPath, $route) === 0) {
                return;
            }
        }

        // ============================================
        // 3. AMBIL TOKEN DARI HEADER
        // ============================================
        $authHeader = $request->getHeaderLine('Authorization');
        
        if (empty($authHeader)) {
            return $this->errorResponse('Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
        }

        // Cek format "Bearer [token]"
        if (strpos($authHeader, 'Bearer ') !== 0) {
            return $this->errorResponse('Format token salah. Gunakan: Bearer [token]', 401);
        }

        // Hapus "Bearer " dari string
        $token = substr($authHeader, 7);

        // ============================================
        // 4. VERIFIKASI TOKEN JWT
        // ============================================
        try {
            $key = getenv('JWT_SECRET') ?: 'rahasia123';
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            
            // Token valid, lanjutkan request
            return;
            
        } catch (\Firebase\JWT\ExpiredException $e) {
            return $this->errorResponse('Token sudah expired. Silakan login ulang.', 401);
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            return $this->errorResponse('Token tidak valid (signature error).', 401);
        } catch (\Exception $e) {
            return $this->errorResponse('Token tidak valid: ' . $e->getMessage(), 401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }

    private function errorResponse($message, $status)
    {
        $response = service('response');
        $response->setStatusCode($status);
        $response->setJSON([
            'status' => 'error',
            'message' => $message
        ]);
        return $response;
    }
}