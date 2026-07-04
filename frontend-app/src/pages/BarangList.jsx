import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../api/barangAPI';
import { kategoriAPI } from '../api/kategoriAPI';
import { supplierAPI } from '../api/supplierAPI';

const BarangList = () => {
    const [barang, setBarang] = useState([]);
    const [barangFull, setBarangFull] = useState([]);
    const [kategori, setKategori] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nama_barang: '',
        harga: 0,
        stok: 0,
        id_kategori: '',
        id_supplier: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // ============================================
    // FETCH DATA
    // ============================================
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [barangRes, kategoriRes, supplierRes] = await Promise.all([
                barangAPI.getAll(),
                kategoriAPI.getAll(),
                supplierAPI.getAll(),
            ]);
            const barangData = barangRes.data.data || [];
            setBarang(barangData);
            setBarangFull(barangData);
            setKategori(kategoriRes.data.data || []);
            setSupplier(supplierRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // SEARCH
    // ============================================
    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        if (keyword === '') {
            setBarang(barangFull);
        } else {
            const filtered = barangFull.filter((item) =>
                item.nama_barang.toLowerCase().includes(keyword.toLowerCase()) ||
                (item.nama_kategori && item.nama_kategori.toLowerCase().includes(keyword.toLowerCase())) ||
                (item.nama_supplier && item.nama_supplier.toLowerCase().includes(keyword.toLowerCase()))
            );
            setBarang(filtered);
        }
    };

    // ============================================
    // FORM HANDLER
    // ============================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const resetForm = () => {
        setFormData({ id: null, nama_barang: '', harga: 0, stok: 0, id_kategori: '', id_supplier: '' });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setFormData({
            id: item.id,
            nama_barang: item.nama_barang,
            harga: item.harga,
            stok: item.stok,
            id_kategori: item.id_kategori,
            id_supplier: item.id_supplier
        });
        setIsEditing(true);
        setShowModal(true);
    };

    // ============================================
    // SUBMIT (CREATE / UPDATE)
    // ============================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.nama_barang || !formData.id_kategori || !formData.id_supplier) {
            setError('Semua field wajib diisi!');
            return;
        }

        try {
            const data = {
                nama_barang: formData.nama_barang,
                harga: parseInt(formData.harga) || 0,
                stok: parseInt(formData.stok) || 0,
                id_kategori: parseInt(formData.id_kategori),
                id_supplier: parseInt(formData.id_supplier)
            };

            if (isEditing) {
                await barangAPI.update(formData.id, data);
                setSuccess('✅ Barang berhasil diupdate!');
            } else {
                await barangAPI.create(data);
                setSuccess('✅ Barang berhasil ditambahkan!');
            }

            await fetchData();
            setSearchKeyword('');
            setTimeout(() => {
                setShowModal(false);
                resetForm();
            }, 1500);
        } catch (error) {
            console.error('Error saving:', error);
            setError(error.response?.data?.message || 'Gagal menyimpan data!');
        }
    };

    // ============================================
    // DELETE
    // ============================================
    const handleDelete = async (id, nama) => {
        if (window.confirm(`Yakin ingin menghapus barang "${nama}"?`)) {
            try {
                await barangAPI.delete(id);
                setSuccess(`✅ Barang "${nama}" berhasil dihapus!`);
                await fetchData();
                setSearchKeyword('');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error('Delete error:', error);
                alert('Gagal menghapus barang!');
            }
        }
    };

    // ============================================
    // RENDER
    // ============================================
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Kembali</button>
                    <h1 style={styles.title}>📦 Data Barang</h1>
                </div>
                <button style={styles.addBtn} onClick={openAddModal}>+ Tambah Barang</button>
            </div>

            {/* SEARCH */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="🔍 Cari barang..."
                    value={searchKeyword}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
                <span style={styles.totalData}>Total: {barang.length} barang</span>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && <div style={styles.successBox}>{success}</div>}

            {/* TABLE */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>No</th>
                            <th style={styles.th}>Nama Barang</th>
                            <th style={styles.th}>Harga</th>
                            <th style={styles.th}>Stok</th>
                            <th style={styles.th}>Kategori</th>
                            <th style={styles.th}>Supplier</th>
                            <th style={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barang.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.emptyData}>📭 Belum ada data</td>
                            </tr>
                        ) : (
                            barang.map((item, index) => (
                                <tr key={item.id} style={styles.tr}>
                                    <td style={styles.td}>{index + 1}</td>   {/* ← NOMOR URUT */}
                                    <td style={styles.td}><strong>{item.nama_barang}</strong></td>
                                    <td style={styles.td}>Rp {Number(item.harga).toLocaleString('id-ID')}</td>
                                    <td style={styles.td}>{item.stok}</td>
                                    <td style={styles.td}>{item.nama_kategori || '-'}</td>
                                    <td style={styles.td}>{item.nama_supplier || '-'}</td>
                                    <td style={styles.td}>
                                        <button style={styles.editBtn} onClick={() => openEditModal(item)}>✏️ Edit</button>
                                        <button style={styles.deleteBtn} onClick={() => handleDelete(item.id, item.nama_barang)}>🗑️ Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2>{isEditing ? '✏️ Edit Barang' : '➕ Tambah Barang'}</h2>
                            <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.modalForm}>
                            {error && <div style={styles.errorBox}>❌ {error}</div>}
                            {success && <div style={styles.successBox}>✅ {success}</div>}

                            <div style={styles.formGroup}>
                                <label>Nama Barang <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" name="nama_barang" value={formData.nama_barang} onChange={handleInputChange} placeholder="Masukkan nama barang" style={styles.input} required />
                            </div>

                            <div style={styles.formGroup}>
                                <label>Harga</label>
                                <input type="number" name="harga" value={formData.harga} onChange={handleInputChange} placeholder="Masukkan harga" style={styles.input} />
                            </div>

                            <div style={styles.formGroup}>
                                <label>Stok</label>
                                <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} placeholder="Masukkan stok" style={styles.input} />
                            </div>

                            <div style={styles.formGroup}>
                                <label>Kategori <span style={{ color: 'red' }}>*</span></label>
                                <select name="id_kategori" value={formData.id_kategori} onChange={handleInputChange} style={styles.input} required>
                                    <option value="">Pilih Kategori</option>
                                    {kategori.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama_kategori}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label>Supplier <span style={{ color: 'red' }}>*</span></label>
                                <select name="id_supplier" value={formData.id_supplier} onChange={handleInputChange} style={styles.input} required>
                                    <option value="">Pilih Supplier</option>
                                    {supplier.map((item) => (
                                        <option key={item.id} value={item.id}>{item.nama_supplier}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.modalFooter}>
                                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" style={styles.submitBtn}>{isEditing ? 'Update' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// STYLES
// ============================================
const styles = {
    container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
    backBtn: { padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    title: { margin: 0, fontSize: '24px', color: '#1a1a2e' },
    addBtn: { padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    searchContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
    searchInput: { flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', maxWidth: '400px', outline: 'none' },
    totalData: { fontSize: '14px', color: '#6c757d' },
    successBox: { backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
    errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
    tableWrapper: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { padding: '14px 16px', backgroundColor: '#f8f9fa', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '2px solid #dee2e6' },
    tr: { borderBottom: '1px solid #e9ecef' },
    td: { padding: '12px 16px', verticalAlign: 'middle' },
    editBtn: { padding: '5px 12px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteBtn: { padding: '5px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    emptyData: { textAlign: 'center', padding: '40px', color: '#6c757d' },
    loadingContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px' },
    spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
    modal: { backgroundColor: 'white', borderRadius: '12px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e9ecef' },
    modalClose: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
    modalForm: { padding: '24px' },
    formGroup: { marginBottom: '18px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e9ecef' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    submitBtn: { padding: '10px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

// CSS Animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default BarangList;