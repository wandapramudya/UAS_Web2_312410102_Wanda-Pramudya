import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { barangAPI } from '../api/barangAPI';
import { kategoriAPI } from '../api/kategoriAPI';
import { supplierAPI } from '../api/supplierAPI';

const Dashboard = () => {
    const [barangCount, setBarangCount] = useState(0);
    const [kategoriCount, setKategoriCount] = useState(0);
    const [supplierCount, setSupplierCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [barangRes, kategoriRes, supplierRes] = await Promise.all([
                barangAPI.getAll(),
                kategoriAPI.getAll(),
                supplierAPI.getAll(),
            ]);

            setBarangCount(barangRes.data.data.length);
            setKategoriCount(kategoriRes.data.data.length);
            setSupplierCount(supplierRes.data.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1>Inventory Management</h1>
                <div>
                    <span style={styles.welcome}>Welcome, {user.username || 'User'}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <h3>{barangCount}</h3>
                    <p>Total Barang</p>
                </div>
                <div style={styles.statCard}>
                    <h3>{kategoriCount}</h3>
                    <p>Total Kategori</p>
                </div>
                <div style={styles.statCard}>
                    <h3>{supplierCount}</h3>
                    <p>Total Supplier</p>
                </div>
            </div>

            {/* Menu */}
            <div style={styles.menuContainer}>
                <div style={styles.menuCard} onClick={() => navigate('/barang')}>
                    <h3>📦 Data Barang</h3>
                    <p>Kelola data barang</p>
                </div>
                <div style={styles.menuCard} onClick={() => navigate('/kategori')}>
                    <h3>📂 Data Kategori</h3>
                    <p>Kelola data kategori</p>
                </div>
                <div style={styles.menuCard} onClick={() => navigate('/supplier')}>
                    <h3>🏢 Data Supplier</h3>
                    <p>Kelola data supplier</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '30px',
    },
    welcome: {
        marginRight: '15px',
        fontWeight: '500',
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '30px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    menuContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
    },
    menuCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
    },
};

export default Dashboard;