import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ClipboardList, Loader, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../utils/auth';

const statusConfig = {
  PENDING:   { icon: Clock,         color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
  CONFIRMED: { icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Confirmed' },
  CANCELLED: { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-500/10',    label: 'Cancelled' },
};

function OrderCard({ order }) {
  const status = statusConfig[order.status] || statusConfig.PENDING;
  const Icon = status.icon;

  return (
    <div className="card hover:border-white/10 transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center shrink-0">
            <Package size={20} className="text-white/30" />
          </div>
          <div>
            <p className="text-white font-medium">{order.productName}</p>
            <p className="text-white/40 text-sm mt-0.5">Order #{order.id}</p>
            <p className="text-white/30 text-xs mt-1">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              }) : '—'}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2">
          <span className={`badge ${status.bg} ${status.color} flex items-center gap-1.5`}>
            <Icon size={12} />
            {status.label}
          </span>
          <p className="font-display text-lg font-bold text-primary-400">
            ₹{Number(order.totalPrice).toLocaleString('en-IN')}
          </p>
          <p className="text-white/30 text-xs">Qty: {order.quantity}</p>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = getUserFromToken();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getByUser(userId);
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">My Orders</h1>
          <p className="text-white/40 text-sm">{orders.length} orders placed</p>
        </div>
        {orders.length > 0 && (
          <div className="card text-right py-3 px-5">
            <p className="text-white/40 text-xs">Total Spent</p>
            <p className="font-display text-xl font-bold text-primary-400">
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Pending',   value: orders.filter(o => o.status === 'PENDING').length,   color: 'text-yellow-400' },
            { label: 'Confirmed', value: orders.filter(o => o.status === 'CONFIRMED').length, color: 'text-green-400' },
            { label: 'Cancelled', value: orders.filter(o => o.status === 'CANCELLED').length, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center py-4">
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader size={32} className="animate-spin text-primary-500" />
          <p className="text-white/40">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32">
          <ClipboardList size={64} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg mb-2">No orders yet</p>
          <p className="text-white/20 text-sm">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
