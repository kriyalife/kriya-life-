const fs = require('fs');
let content = fs.readFileSync('src/components/admin/DashboardOverview.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    loadRealtimeData();

    // Poll every 3 seconds for live real-time sync across windows/tabs
    const interval = setInterval(() => {
      const local = getLocalOrders();
      setOrders(local);
      setLastUpdated(new Date());
    }, 3000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kriya_supabase_local_orders') {
        loadRealtimeData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);`;
  
const replaceEffect = `  useEffect(() => {
    loadRealtimeData();

    // Poll every 5 seconds for live real-time sync across windows/tabs
    const interval = setInterval(() => {
      loadRealtimeData();
    }, 5000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kriya_supabase_local_orders') {
        loadRealtimeData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);`;
  
content = content.replace(targetEffect, replaceEffect);
fs.writeFileSync('src/components/admin/DashboardOverview.tsx', content);

let ordersContent = fs.readFileSync('src/components/admin/OrdersManager.tsx', 'utf8');
const targetStatusUpdate = `    try {
      updateLocalOrderStatus(id, newStatus);
      showToast('Status Updated', \`Order marked as \${newStatus}.\`);`;
const replaceStatusUpdate = `    try {
      await updateOrderStatusInSupabase(id, newStatus);
      showToast('Status Updated', \`Order marked as \${newStatus}.\`);`;
ordersContent = ordersContent.replace(targetStatusUpdate, replaceStatusUpdate);

const targetDelete = `    try {
      deleteLocalOrder(id);
      showToast('Order Deleted', 'The order has been removed.');`;
const replaceDelete = `    try {
      await deleteOrderFromSupabase(id);
      showToast('Order Deleted', 'The order has been removed.');`;
ordersContent = ordersContent.replace(targetDelete, replaceDelete);

fs.writeFileSync('src/components/admin/OrdersManager.tsx', ordersContent);

console.log('Fixed undefined variables.');
