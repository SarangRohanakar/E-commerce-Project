import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, TrendingUp,
         AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import { productAPI, orderAPI } from '../services/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await productAPI.getAll();
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const lowStock = products.filter((p) => p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * p.stock, 0
  );

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Low Stock',
      value: lowStock.length,
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Out of Stock',
      value: outOfStock.length,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Inventory Value',
      value: `₹${totalValue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">
          Admin Dashboard
        </h1>
        <p className="text-white/40">Overview of your store</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader size={32} className="animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-white/40 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link to="/admin/products"
              className="card hover:border-primary-500/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center mb-3">
                    <Package size={18} className="text-primary-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1">
                    Manage Products
                  </h3>
                  <p className="text-white/40 text-sm">Add, edit or delete products</p>
                </div>
                <ArrowRight size={20} className="text-white/20 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/orders"
              className="card hover:border-primary-500/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center mb-3">
                    <ClipboardList size={18} className="text-primary-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1">
                    View All Orders
                  </h3>
                  <p className="text-white/40 text-sm">Monitor all customer orders</p>
                </div>
                <ArrowRight size={20} className="text-white/20 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>
          </div>

          {/* Low Stock Warning */}
          {lowStock.length > 0 && (
            <div className="card border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={18} className="text-yellow-400" />
                <h3 className="font-semibold text-yellow-400">
                  Low Stock Alert ({lowStock.length} products)
                </h3>
              </div>
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{p.name}</span>
                    <span className={`badge ${p.stock === 0
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}