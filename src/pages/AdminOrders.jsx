import React, { useEffect, useState } from 'react';
import { Loader, ClipboardList, ChevronDown } from 'lucide-react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusOptions = ['PENDING', 'CONFIRMED', 'CANCELLED'];

const statusConfig = {
  PENDING:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  CONFIRMED: { color: 'text-green-400',  bg: 'bg-green-500/10'  },
  CANCELLED: { color: 'text-red-400',    bg: 'bg-red-500/10'    },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // orderId being updated

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/api/orders/${orderId}/status?status=${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success(`Order #${orderId} updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">All Orders</h1>
        <p className="text-white/40 text-sm">{orders.length} total orders</p>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statusOptions.map((status) => {
            const cfg = statusConfig[status];
            return (
              <div key={status} className="card text-center py-4">
                <p className={`font-display text-2xl font-bold ${cfg.color}`}>
                  {orders.filter((o) => o.status === status).length}
                </p>
                <p className="text-white/40 text-xs mt-1">{status}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader size={32} className="animate-spin text-primary-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32">
          <ClipboardList size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40">No orders placed yet</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Order ID', 'User ID', 'Product', 'Qty', 'Total', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-white/40 text-sm font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const cfg = statusConfig[order.status] || statusConfig.PENDING;
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 text-white/60 text-sm font-mono">#{order.id}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">{order.userId}</td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{order.productName}</p>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{order.quantity}</td>
                      <td className="px-6 py-4">
                        <span className="text-primary-400 font-semibold text-sm">
                          ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer transition-all
                              ${cfg.bg} ${cfg.color}
                              focus:outline-none focus:ring-1 focus:ring-primary-500/30
                              disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s} className="bg-dark-800 text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${cfg.color}`}
                          />
                          {updating === order.id && (
                            <Loader size={10} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-primary-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}