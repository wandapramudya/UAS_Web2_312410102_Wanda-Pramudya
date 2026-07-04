<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class AuthController extends BaseController
{
    use ResponseTrait;

    public function login()
    {
        // Ambil data dari request
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        // Validasi input
        if (!$username || !$password) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Username dan password wajib diisi'
            ], 400);
        }

        // Cari user di database
        $model = new UserModel();
        $user = $model->where('username', $username)->first();

        // Cek apakah user ditemukan
        if (!$user) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Username tidak ditemukan'
            ], 404);
        }

        // Verifikasi password
        if (!password_verify($password, $user['password'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Password salah',
                'debug' => [
                    'input_password' => $password,
                    'hash_from_db' => $user['password']
                ]
            ], 401);
        }

        // Login berhasil
        return $this->respond([
            'status' => 'success',
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username']
                ],
                'token' => 'ini_token_sementara_' . time()
            ]
        ]);
    }

    public function register()
    {
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        if (!$username || !$password) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Username dan password wajib diisi'
            ], 400);
        }

        $model = new UserModel();

        // Cek username sudah ada
        $existing = $model->where('username', $username)->first();
        if ($existing) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Username sudah digunakan'
            ], 400);
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Simpan
        $data = [
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT)
        ];

        if (!$model->insert($data)) {
        dd($model->errors());
        }

        echo $model->getLastQuery();
        die();

        return $this->respond([
            'status' => 'success',
            'message' => 'Registrasi berhasil',
            'data' => [
                'username' => $username,
                'hashed_password' => $hashedPassword // Untuk debug
            ]
        ], 201);
    }
}