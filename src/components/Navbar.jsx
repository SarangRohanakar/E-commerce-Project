import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, LogOut, Package, Home, ClipboardList, User, Menu, X, Settings } from 'lucide-react';
import { logout } from '../store/store';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((s) => s.cart.items);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },   
    { to: '/products', label: 'Products', icon: Package },
    { to: '/orders', label: 'My Orders', icon: ClipboardList },
    ...(user?.role === 'ADMIN'
    ? [{ to: '/admin/products', label: 'Admin', icon: Settings },
      {to: '/admin/dashboard', label: 'Dashboard', icon: Settings},
      { to: '/admin/orders', label: 'All Orders', icon: ClipboardList }
    ]
    : []),  
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-400 transition-colors">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              Ecom<span className="text-primary-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(to)
                      ? 'bg-primary-500/10 text-primary-400'
                      : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link to="/cart" className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-fade-in">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <User size={14} className="text-primary-400" />
                  <span className="text-sm text-white/70">{user?.email?.split('@')[0]}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Register</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {isAuthenticated && (
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/50 hover:text-white">
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && isAuthenticated && (
          <div className="md:hidden pb-4 animate-slide-up">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive(to) ? 'bg-primary-500/10 text-primary-400' : 'text-white/50 hover:text-white'}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
