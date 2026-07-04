import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../api/supplierAPI';

const SupplierList = () => {
    const [supplier, setSupplier] = useState([]);
    const [supplierFull, setSupplierFull] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nama_supplier: '',
        alamat: '',
        kontak: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSupplier();
    }, []);

    const fetchSupplier = async () => {
        try {
            setLoading(true);
            const response = await supplierAPI.getAll();
            const data = response.data.data || [];
            setSupplier(data);
            setSupplierFull(data);
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // SEARCH (Tanpa Loading)
    // ============================================
    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        if (keyword === '') {
            setSupplier(supplierFull);
        } else {
            const filtered = supplierFull.filter((item) =>
                item.nama_supplier.toLowerCase().includes(keyword.toLowerCase()) ||
                (item.alamat && item.alamat.toLowerCase().includes(keyword.toLowerCase())) ||
                (item.kontak && item.kontak.includes(keyword))
            );
            setSupplier(filtered);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const resetForm = () => {
        setFormData({ id: null, nama_supplier: '', alamat: '', kontak: '' });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    const openAdd = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (item) => {
        setFormData({
            id: item.id,
            nama_supplier: item.nama_supplier,
            alamat: item.alamat || '',
            kontak: item.kontak || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.nama_supplier) {
            setError('Nama supplier wajib diisi!');
            return;
        }

        try {
            const data = {
                nama_supplier: formData.nama_supplier,
                alamat: formData.alamat,
                kontak: formData.kontak
            };

            if (isEditing) {
                await supplierAPI.update(formData.id, data);
                setSuccess('✅ Supplier berhasil diupdate!');
            } else {
                await supplierAPI.create(data);
                setSuccess('✅ Supplier berhasil ditambahkan!');
            }

            await fetchSupplier();
            setSearchKeyword('');
            setTimeout(() => {
                setShowModal(false);
                resetForm();
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Gagal menyimpan data!');
        }
    };

    const handleDelete = async (id, nama) => {
        if (window.confirm(`Yakin ingin menghapus "${nama}"?`)) {
            try {
                await supplierAPI.delete(id);
                setSuccess(`✅ "${nama}" berhasil dihapus!`);
                await fetchSupplier();
                setSearchKeyword('');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                alert('Gagal menghapus!');
            }
        }
    };

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
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Kembali</button>
                    <h1 style={styles.title}>🏢 Data Supplier</h1>
                </div>
                <button style={styles.addBtn} onClick={openAdd}>+ Tambah Supplier</button>
            </div>

            {/* SEARCH */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="🔍 Cari supplier..."
                    value={searchKeyword}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
                <span style={styles.totalData}>Total: {supplier.length} supplier</span>
            </div>

            {success && <div style={styles.successBox}>{success}</div>}

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>No</th>
                            <th style={styles.th}>Nama Supplier</th>
                            <th style={styles.th}>Alamat</th>
                            <th style={styles.th}>Kontak</th>
                            <th style={styles.th}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplier.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={styles.emptyData}>📭 Belum ada data</td>
                            </tr>
                        ) : (
                            supplier.map((item, index) => (
                                <tr key={item.id} style={styles.tr}>
                                    <td style={styles.td}>{index + 1}</td>   {/* ← NOMOR URUT */}
                                    <td style={styles.td}><strong>{item.nama_supplier}</strong></td>
                                    <td style={styles.td}>{item.alamat || '-'}</td>
                                    <td style={styles.td}>{item.kontak || '-'}</td>
                                    <td style={styles.td}>
                                        <button style={styles.editBtn} onClick={() => openEdit(item)}>✏️ Edit</button>
                                        <button style={styles.deleteBtn} onClick={() => handleDelete(item.id, item.nama_supplier)}>🗑️ Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2>{isEditing ? '✏️ Edit Supplier' : '➕ Tambah Supplier'}</h2>
                            <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} style={styles.modalForm}>
                            {error && <div style={styles.errorBox}>❌ {error}</div>}
                            {success && <div style={styles.successBox}>✅ {success}</div>}

                            <div style={styles.formGroup}>
                                <label>Nama Supplier <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    name="nama_supplier"
                                    value={formData.nama_supplier}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama supplier"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label>Alamat</label>
                                <textarea
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat supplier"
                                    style={styles.textarea}
                                    rows="3"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label>Kontak</label>
                                <input
                                    type="text"
                                    name="kontak"
                                    value={formData.kontak}
                                    onChange={handleChange}
                                    placeholder="Masukkan nomor kontak"
                                    style={styles.input}
                                />
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
    textarea: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e9ecef' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    submitBtn: { padding: '10px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

// CSS Animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default SupplierList;