import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../store/store';
import toast from 'react-hot-toast';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const handleQuantity = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-white mb-8">Your Cart</h1>
        <div className="text-center py-32">
          <ShoppingBag size={64} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg mb-6">Your cart is empty</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 animate-slide-in">
              {/* Image */}
              <div className="w-20 h-20 bg-dark-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  : <ShoppingBag size={24} className="text-white/20" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{item.name}</h3>
                <p className="text-white/40 text-sm">{item.category}</p>
                <p className="text-primary-400 font-semibold mt-1">
                  ₹{Number(item.price).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => handleQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-white font-medium text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right hidden sm:block">
                <p className="text-white/40 text-xs">Subtotal</p>
                <p className="text-white font-semibold">
                  ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.id, item.name)}
                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="font-display text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/50 truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="text-white/70 shrink-0">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal</span>
                <span className="text-white font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-white/60">Delivery</span>
                <span className="text-green-400 text-sm font-medium">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/5">
              <span className="font-display text-lg font-bold text-white">Total</span>
              <span className="font-display text-xl font-bold text-primary-400">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <Link to="/products" className="btn-secondary w-full flex items-center justify-center gap-2 mt-3 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
