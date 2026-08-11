import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Ticket, Search, Loader2, Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  expires_at: string | null;
  is_active: boolean;
  created_at?: string;
}

export const CouponsManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { showToast } = useShop();

  // Form State
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 0,
    min_order: 0,
    max_discount: null,
    usage_limit: null,
    expires_at: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const DEFAULT_COUPONS: Coupon[] = [
    {
      id: 'c1',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      min_order: 50,
      max_discount: 100,
      usage_limit: 500,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'c2',
      code: 'KRIYA20',
      type: 'percentage',
      value: 20,
      min_order: 100,
      max_discount: 200,
      usage_limit: 100,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'c3',
      code: 'FREESHIP',
      type: 'fixed',
      value: 15,
      min_order: 40,
      max_discount: 15,
      usage_limit: null,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  const getLocalCoupons = (): Coupon[] => {
    try {
      const saved = localStorage.getItem('kriya_local_coupons');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('kriya_local_coupons', JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setCoupons(data);
      } else {
        setCoupons(getLocalCoupons());
      }
    } catch (err) {
      console.warn('Notice fetching coupons from Supabase, using fallback coupons:', err);
      setCoupons(getLocalCoupons());
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        min_order: coupon.min_order,
        max_discount: coupon.max_discount,
        usage_limit: coupon.usage_limit,
        expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : '',
        is_active: coupon.is_active
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        min_order: 0,
        max_discount: null,
        usage_limit: null,
        expires_at: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code?.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        min_order: Number(formData.min_order) || 0,
        max_discount: formData.max_discount ? Number(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        is_active: formData.is_active
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', editingCoupon.id);
        if (error) throw error;
        showToast('Success', 'Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([payload]);
        if (error) throw error;
        showToast('Success', 'Coupon created successfully');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error: any) {
      showToast('Error', error.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      showToast('Success', 'Coupon deleted');
      fetchCoupons();
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to delete coupon');
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', coupon.id);
      if (error) throw error;
      showToast('Success', `Coupon ${coupon.is_active ? 'disabled' : 'activated'}`);
      fetchCoupons();
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update status');
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold">Coupons</h2>
          <p className="text-sm text-emerald-100/70">Manage discount codes and promotions.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white">
        <div className="p-4 border-b border-white/10 bg-stone-950/60">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-950 border-b border-white/10 text-emerald-300 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Min Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-emerald-100/60">
                      <Ticket className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                      <p className="font-medium text-white">No coupons found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-emerald-300">{coupon.code}</td>
                      <td className="px-6 py-4 font-medium text-white">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                      </td>
                      <td className="px-6 py-4 text-emerald-100/80">₹{coupon.min_order}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(coupon)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
                            coupon.is_active 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900' 
                              : 'bg-stone-800 text-stone-400 border-white/10 hover:bg-stone-700'
                          }`}
                        >
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-emerald-100/70">
                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="p-1.5 text-emerald-100/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-1.5 text-emerald-100/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 text-white shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-stone-950 z-10">
              <h3 className="font-serif text-xl font-bold text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-100/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-white">
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-white/20 rounded-xl uppercase bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="percentage" className="bg-stone-900 text-white">Percentage</option>
                    <option value="fixed" className="bg-stone-900 text-white">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Min Order Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_order}
                    onChange={e => setFormData({...formData, min_order: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Max Discount (Optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_discount || ''}
                    onChange={e => setFormData({...formData, max_discount: e.target.value ? Number(e.target.value) : null})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit || ''}
                    onChange={e => setFormData({...formData, usage_limit: e.target.value ? Number(e.target.value) : null})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-200 uppercase mb-1">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={e => setFormData({...formData, expires_at: e.target.value})}
                    className="w-full px-4 py-2 border border-white/20 rounded-xl bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-stone-950 border border-white/10">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded text-emerald-400 focus:ring-emerald-400 border-white/20"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-white cursor-pointer">
                  Coupon is active
                </label>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-sm border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-extrabold text-sm bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-lg"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
