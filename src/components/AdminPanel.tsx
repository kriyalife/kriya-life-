import React from 'react';
import { useShop } from '../context/ShopContext';
import { AdminDashboard } from './admin/AdminDashboard';

export const AdminPanel: React.FC = () => {
  const { currentUser, logoutUser } = useShop();

  // Logged In Admin Panel View -> Render Dashboard Layout
  return (
    <AdminDashboard 
      onLogout={logoutUser} 
      adminEmail={currentUser?.email || 'admin@kriyacosmetics.com'} 
    />
  );
};
