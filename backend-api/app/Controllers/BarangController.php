<?php

namespace App\Controllers;

use App\Models\BarangModel;
use CodeIgniter\API\ResponseTrait;

class BarangController extends BaseController
{
    use ResponseTrait;

    // ============================================
    // READ ALL - GET /api/barang
    // ============================================
    public function index()
    {
        $model = new BarangModel();
        $data = $model->getBarangLengkap();

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }

    // ============================================
    // READ ONE - GET /api/barang/{id}
    // ============================================
    public function show($id = null)
    {
        $model = new BarangModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Barang tidak ditemukan'
            ], 404);
        }

        $barang = $model->select('barang.*, kategori.nama_kategori, supplier.nama_supplier')
                        ->join('kategori', 'kategori.id = barang.id_kategori')
                        ->join('supplier', 'supplier.id = barang.id_supplier')
                        ->find($id);

        return $this->respond([
            'status' => 'success',
            'data' => $barang
        ]);
    }

    // ============================================
    // CREATE - POST /api/barang
    // ============================================
    public function create()
    {
        $model = new BarangModel();
        $json = $this->request->getJSON();

        $nama_barang = $json->nama_barang ?? $this->request->getPost('nama_barang');
        $harga = $json->harga ?? $this->request->getPost('harga');
        $stok = $json->stok ?? $this->request->getPost('stok');
        $id_kategori = $json->id_kategori ?? $this->request->getPost('id_kategori');
        $id_supplier = $json->id_supplier ?? $this->request->getPost('id_supplier');

        if (!$nama_barang || !$id_kategori || !$id_supplier) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama barang, kategori, dan supplier wajib diisi'
            ], 400);
        }

        $data = [
            'nama_barang' => $nama_barang,
            'harga' => $harga ?? 0,
            'stok' => $stok ?? 0,
            'id_kategori' => $id_kategori,
            'id_supplier' => $id_supplier
        ];

        $model->save($data);

        return $this->respond([
            'status' => 'success',
            'message' => 'Barang berhasil ditambahkan',
            'data' => [
                'id' => $model->getInsertID(),
                'nama_barang' => $nama_barang,
                'harga' => $harga ?? 0,
                'stok' => $stok ?? 0,
                'id_kategori' => $id_kategori,
                'id_supplier' => $id_supplier
            ]
        ], 201);
    }

    // ============================================
    // UPDATE - PUT /api/barang/{id}
    // ============================================
    public function update($id = null)
    {
        $model = new BarangModel();
        $json = $this->request->getJSON();

        // Cek apakah data ada
        $data = $model->find($id);
        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Barang tidak ditemukan'
            ], 404);
        }

        // Ambil data dari JSON atau POST
        $nama_barang = $json->nama_barang ?? $this->request->getPost('nama_barang');
        $harga = $json->harga ?? $this->request->getPost('harga');
        $stok = $json->stok ?? $this->request->getPost('stok');
        $id_kategori = $json->id_kategori ?? $this->request->getPost('id_kategori');
        $id_supplier = $json->id_supplier ?? $this->request->getPost('id_supplier');

        // Validasi
        if (!$nama_barang) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama barang wajib diisi'
            ], 400);
        }

        $updateData = [
            'nama_barang' => $nama_barang,
            'harga' => $harga ?? 0,
            'stok' => $stok ?? 0,
            'id_kategori' => $id_kategori ?? $data['id_kategori'],
            'id_supplier' => $id_supplier ?? $data['id_supplier']
        ];

        $model->update($id, $updateData);

        return $this->respond([
            'status' => 'success',
            'message' => 'Barang berhasil diupdate'
        ]);
    }

    // ============================================
    // DELETE - DELETE /api/barang/{id}
    // ============================================
    public function delete($id = null)
    {
        $model = new BarangModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Barang tidak ditemukan'
            ], 404);
        }

        $model->delete($id);

        return $this->respond([
            'status' => 'success',
            'message' => 'Barang berhasil dihapus'
        ]);
    }

    // ============================================
    // SEARCH - GET /api/barang/search?keyword=xxx
    // ============================================
    public function search()
    {
        $keyword = $this->request->getGet('keyword');
        
        if (!$keyword) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Keyword pencarian wajib diisi'
            ], 400);
        }

        $model = new BarangModel();
        $data = $model->searchBarang($keyword);

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }
}