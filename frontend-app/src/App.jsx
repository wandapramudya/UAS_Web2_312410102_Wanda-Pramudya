import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BarangList from './pages/BarangList';
import KategoriList from './pages/KategoriList';
import SupplierList from './pages/SupplierList';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/barang"
                    element={
                        <PrivateRoute>
                            <BarangList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/kategori"
                    element={
                        <PrivateRoute>
                            <KategoriList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/supplier"
                    element={
                        <PrivateRoute>
                            <SupplierList />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;