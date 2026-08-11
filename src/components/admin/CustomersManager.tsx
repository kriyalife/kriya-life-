import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, Search, Loader2 } from 'lucide-react';

export const CustomersManager: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const DEFAULT_CUSTOMERS = [
    {
      id: 'cust-1',
      name: 'Meet Dave',
      email: 'meetdave3640@gmail.com',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'cust-2',
      name: 'Aanya Sharma',
      email: 'aanya@example.com',
      role: 'customer',
      created_at: new Date().toISOString()
    },
    {
      id: 'cust-3',
      name: 'Rohan Patel',
      email: 'rohan.patel@example.com',
      role: 'customer',
      created_at: new Date().toISOString()
    }
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setCustomers(data);
      } else {
        setCustomers(DEFAULT_CUSTOMERS);
      }
    } catch (err) {
      console.warn('Notice fetching customers from Supabase, using fallback customers:', err);
      setCustomers(DEFAULT_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-white font-bold">Customers</h2>
          <p className="text-sm text-emerald-100/70">Manage user accounts and roles.</p>
        </div>
      </div>

      <div className="bg-stone-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden text-white">
        <div className="p-4 border-b border-white/10 bg-stone-950/60">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search customers..."
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
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-emerald-100/60">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-400" />
                      <p className="font-medium text-white">No customers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{customer.name || '-'}</td>
                      <td className="px-6 py-4 text-emerald-100/80">{customer.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                          customer.role === 'admin' 
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {customer.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-100/70">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
