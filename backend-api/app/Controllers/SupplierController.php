<?php

namespace App\Controllers;

use App\Models\SupplierModel;
use CodeIgniter\API\ResponseTrait;

class SupplierController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new SupplierModel();
        $data = $model->findAll();

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function show($id = null)
    {
        $model = new SupplierModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Supplier tidak ditemukan'
            ], 404);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function create()
    {
        $model = new SupplierModel();
        $json = $this->request->getJSON();

        $nama_supplier = $json->nama_supplier ?? $this->request->getPost('nama_supplier');
        $alamat = $json->alamat ?? $this->request->getPost('alamat');
        $kontak = $json->kontak ?? $this->request->getPost('kontak');

        if (!$nama_supplier) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama supplier wajib diisi'
            ], 400);
        }

        $data = [
            'nama_supplier' => $nama_supplier,
            'alamat' => $alamat,
            'kontak' => $kontak
        ];

        $model->save($data);

        return $this->respond([
            'status' => 'success',
            'message' => 'Supplier berhasil ditambahkan',
            'data' => [
                'id' => $model->getInsertID(),
                'nama_supplier' => $nama_supplier,
                'alamat' => $alamat,
                'kontak' => $kontak
            ]
        ], 201);
    }

    public function update($id = null)
    {
        $model = new SupplierModel();
        $json = $this->request->getJSON();

        $data = $model->find($id);
        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Supplier tidak ditemukan'
            ], 404);
        }

        $nama_supplier = $json->nama_supplier ?? $this->request->getPost('nama_supplier');
        $alamat = $json->alamat ?? $this->request->getPost('alamat');
        $kontak = $json->kontak ?? $this->request->getPost('kontak');

        if (!$nama_supplier) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Nama supplier wajib diisi'
            ], 400);
        }

        $updateData = [
            'nama_supplier' => $nama_supplier,
            'alamat' => $alamat,
            'kontak' => $kontak
        ];

        $model->update($id, $updateData);

        return $this->respond([
            'status' => 'success',
            'message' => 'Supplier berhasil diupdate'
        ]);
    }

    public function delete($id = null)
    {
        $model = new SupplierModel();
        $data = $model->find($id);

        if (!$data) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Supplier tidak ditemukan'
            ], 404);
        }

        $model->delete($id);

        return $this->respond([
            'status' => 'success',
            'message' => 'Supplier berhasil dihapus'
        ]);
    }
}