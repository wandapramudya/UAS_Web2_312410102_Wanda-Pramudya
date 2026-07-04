<?php

namespace App\Models;

use CodeIgniter\Model;

class BarangModel extends Model
{
    protected $table            = 'barang';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['nama_barang', 'harga', 'stok', 'id_kategori', 'id_supplier'];

    // ============================================
    // GUNAKAN TIMESTAMP (karena tabel barang punya created_at & updated_at)
    // ============================================
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // ============================================
    // GET BARANG LENGKAP (dengan relasi)
    // ============================================
    public function getBarangLengkap()
    {
        return $this->select('barang.*, kategori.nama_kategori, supplier.nama_supplier')
                    ->join('kategori', 'kategori.id = barang.id_kategori')
                    ->join('supplier', 'supplier.id = barang.id_supplier')
                    ->findAll();
    }

    // ============================================
    // SEARCH BARANG
    // ============================================
    public function searchBarang($keyword)
    {
        return $this->select('barang.*, kategori.nama_kategori, supplier.nama_supplier')
                    ->join('kategori', 'kategori.id = barang.id_kategori')
                    ->join('supplier', 'supplier.id = barang.id_supplier')
                    ->like('barang.nama_barang', $keyword)
                    ->orLike('kategori.nama_kategori', $keyword)
                    ->orLike('supplier.nama_supplier', $keyword)
                    ->findAll();
    }
}