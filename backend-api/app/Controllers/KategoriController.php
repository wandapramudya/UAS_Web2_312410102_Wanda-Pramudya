<?php

namespace App\Controllers;

use App\Models\KategoriModel;
use CodeIgniter\API\ResponseTrait;

class KategoriController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new KategoriModel();
        $data = $model->findAll();

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function show($id = null)
    {
        $model = new KategoriModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function create()
    {
        $model = new KategoriModel();
        $json = $this->request->getJSON();
        $nama_kategori = $json->nama_kategori ?? $this->request->getPost('nama_kategori');

        if (!$nama_kategori) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama kategori wajib diisi'
            ], 400);
        }

        $data = ['nama_kategori' => $nama_kategori];
        $model->save($data);

        return $this->respond([
            'status' => 'success',
            'message' => 'Kategori berhasil ditambahkan',
            'data' => [
                'id' => $model->getInsertID(),
                'nama_kategori' => $nama_kategori
            ]
        ], 201);
    }

    public function update($id = null)
    {
        $model = new KategoriModel();
        $json = $this->request->getJSON();

        $data = $model->find($id);
        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        $nama_kategori = $json->nama_kategori ?? $this->request->getPost('nama_kategori');

        if (!$nama_kategori) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama kategori wajib diisi'
            ], 400);
        }

        $model->update($id, ['nama_kategori' => $nama_kategori]);

        return $this->respond([
            'status' => 'success',
            'message' => 'Kategori berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new KategoriModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        $model->delete($id);

        return $this->respond([
            'status' => 'success',
            'message' => 'Kategori berhasil dihapus'
        ]);
    }
}