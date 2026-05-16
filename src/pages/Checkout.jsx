import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, CheckCircle, Loader, ShoppingBag } from 'lucide-react';
import { orderAPI, paymentAPI } from '../services/api';
import { clearCart } from '../store/store';
import toast from 'react-hot-toast';
 import { getUserFromToken } from '../utils/auth';

const paymentMethods = [
  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'UPI', label: 'UPI Payment', icon: Smartphone },
  { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // review | processing | success

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const { userId } = getUserFromToken(); // In real app extract from JWT token

  const handlePlaceOrder = async () => {
    setLoading(true);
    setStep('processing');
    try {
      // Place order for each cart item
      const orderPromises = items.map((item) =>
        orderAPI.place({ productId: item.id, quantity: item.quantity, userId })
      );
      const orders = await Promise.all(orderPromises);

      // Process payment for first order (simplified)
      await paymentAPI.process({
        orderId: orders[0].data.id,
        userId,
        amount: total,
        paymentMethod,
      });

      dispatch(clearCart());
      setStep('success');
      toast.success('Order placed successfully!');

      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      setStep('review');
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-slide-up">
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Order Placed!</h1>
          <p className="text-white/40 mb-2">Your payment was successful</p>
          <p className="text-white/20 text-sm">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader size={40} className="text-primary-400 animate-spin" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Processing Payment</h1>
          <p className="text-white/40">Please wait while we process your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-white mb-6">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                    ${paymentMethod === id
                      ? 'border-primary-500/50 bg-primary-500/5'
                      : 'border-white/5 hover:border-white/10 hover:bg-white/2'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                    ${paymentMethod === id ? 'bg-primary-500/20' : 'bg-dark-700'}`}>
                    <Icon size={18} className={paymentMethod === id ? 'text-primary-400' : 'text-white/40'} />
                  </div>
                  <span className={`font-medium ${paymentMethod === id ? 'text-white' : 'text-white/50'}`}>
                    {label}
                  </span>
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${paymentMethod === id ? 'border-primary-500 bg-primary-500' : 'border-white/20'}`}>
                    {paymentMethod === id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h2 className="font-display text-xl font-semibold text-white mb-6">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag size={18} className="text-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.name}</p>
                    <p className="text-white/40 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium shrink-0">
                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="font-display text-xl font-bold text-white mb-6">Payment Summary</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Items ({items.length})</span>
                <span className="text-white">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Delivery</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Payment</span>
                <span className="text-white">{paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-display text-lg font-bold text-white">Total</span>
                <span className="font-display text-xl font-bold text-primary-400">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <CreditCard size={18} />}
              {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>

            <p className="text-white/20 text-xs text-center mt-4">
              🔒 Secured by JWT Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
