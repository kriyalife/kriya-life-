import React, { useState, useEffect } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { fetchOrdersFromSupabase, updateOrderStatusInSupabase, deleteOrderFromSupabase, OrderRecord } from '../../lib/db';
import { autoSeedSupabase } from '../../lib/autoSeedSupabase';
import { format } from 'date-fns';
import { 
  Search, 
  ArrowUpDown, 
  MoreHorizontal, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderDetailsModal } from './OrderDetailsModal';

type Order = OrderRecord;

const columnHelper = createColumnHelper<Order>();

export const OrdersManager: React.FC = () => {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { showToast } = useShop();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      await autoSeedSupabase().catch(() => {});
      const dbOrders = await fetchOrdersFromSupabase();
      setData(dbOrders);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    
    // Optimistic update
    setData(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));

    try {
      await updateOrderStatusInSupabase(id, newStatus);
      showToast('Status Updated', `Order ${id.substring(0, 8)} status changed to ${newStatus}.`);
    } catch (err) {
      // Revert on error
      setData(prev => prev.map(o => o.id === id ? { ...o, status: currentStatus } : o));
      showToast('Error', 'Failed to update order status.', 'error');
    }
  };

  const handleDelete = async (id: string, orderRecord?: Order) => {
    if (!id) return;
    setData(prev => prev.filter(o => o.id !== id));
    
    try {
      await deleteOrderFromSupabase(id, orderRecord);
      showToast('Order Deleted', 'The order has been permanently removed.');
    } catch (err) {
      showToast('Error', 'Failed to delete order.', 'error');
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'Order ID',
      cell: info => <span className="font-mono text-xs text-emerald-300">{info.getValue().substring(0, 8)}</span>,
    }),
    columnHelper.accessor(row => row.customer_email || row.user_email, {
      id: 'customer_email',
      header: 'Email',
      cell: info => (
        <div className="font-medium text-white">{info.getValue() || "N/A"}</div>
      ),
    }),
    columnHelper.accessor(row => row.product_name || row.product_id, {
      id: 'product_name',
      header: 'Product',
      cell: info => (
        <div className="max-w-[200px] truncate font-medium text-white" title={info.getValue()}>
          {info.getValue() || "N/A"}
        </div>
      ),
    }),
    columnHelper.accessor(row => {
      const qty = row.quantity || 1;
      return typeof row.total_price === 'number' && row.total_price > 0
        ? (row.total_price / qty)
        : (row.price || 0);
    }, {
      id: 'price',
      header: 'Unit Price',
      cell: info => (
        <div className="text-emerald-100/90">₹{Number(info.getValue() || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      ),
    }),
    columnHelper.accessor('quantity', {
      header: 'Qty',
      cell: info => (
        <div className="text-emerald-100/80">{info.getValue() || 1}</div>
      ),
    }),
    columnHelper.accessor(row => {
      return typeof row.total_price === 'number' && row.total_price > 0
        ? row.total_price
        : (row.price || 0) * (row.quantity || 1);
    }, {
      id: 'total_price',
      header: 'Total',
      cell: info => (
        <div className="font-semibold text-emerald-300">₹{Number(info.getValue() || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="flex items-center gap-1 hover:text-white cursor-pointer">
          Date <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: info => {
        const val = info.getValue();
        return <span className="text-sm text-emerald-100/80">{val ? format(new Date(val), 'MMM dd, yyyy') : 'N/A'}</span>;
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const isCompleted = status === 'Completed';
        return (
          <button 
            onClick={() => handleStatusToggle(info.row.original.id, status)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
              isCompleted ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900' : 'bg-amber-950 text-amber-300 border-amber-500/40 hover:bg-amber-900'
            }`}
          >
            {isCompleted ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
            {status || 'Pending'}
          </button>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: info => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setSelectedOrder(info.row.original)} className="p-1.5 text-emerald-100/60 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(info.row.original.id, info.row.original)} className="p-1.5 text-emerald-100/60 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer" title="Delete Order">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    })
  ] as ColumnDef<Order, any>[];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleExportCSV = () => {
    if (data.length === 0) {
      showToast('No Data', 'There are no orders to export.', 'info');
      return;
    }
    
    const headers = ['Order ID', 'Email', 'Phone', 'Product', 'Quantity', 'Address', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(order => 
        [
          order.id, 
          `"${order.customer_email || order.user_email || ''}"`, 
          `"${order.phone || ''}"`, 
          `"${order.product_name || ''}"`, 
          order.quantity, 
          `"${order.address || ''}"`, 
          order.status,
          order.created_at ? format(new Date(order.created_at), 'yyyy-MM-dd') : ''
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kriya_orders_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Export Successful', 'Orders exported to CSV.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Orders</h1>
          <p className="text-sm text-emerald-100/70 mt-1">Manage and track customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOrders} className="px-4 py-2 bg-stone-900/80 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg border border-white/15 transition-colors flex items-center gap-2 cursor-pointer">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" /> Refresh
          </button>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-extrabold rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onStatusChange={handleStatusToggle}
        />
      )}
      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col text-white">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-stone-950/60">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, customers, or products..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-900 rounded-lg border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-950 border-b border-white/10 text-emerald-300 font-medium">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                    <p className="text-emerald-100/70 mt-2 text-sm">Loading orders...</p>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <p className="text-emerald-100/70">No orders found.</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-stone-950/60 text-xs text-emerald-100/70 flex justify-between items-center">
          <span>Showing {table.getRowModel().rows.length} orders</span>
        </div>
      </div>
    </div>
  );
};
