import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, Zap, Shield, Truck, ArrowRight } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Microservices architecture ensures blazing speed' },
  { icon: Shield, title: 'Secure Payments', desc: 'JWT-secured transactions you can trust' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Real-time order tracking at every step' },
];

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];

export default function Home() {
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Zap size={14} className="text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">Powered by Microservices</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
            Shop Smarter,<br />
            <span className="text-primary-500">Live Better</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up">
            Discover thousands of products with lightning-fast delivery,
            secure payments, and an experience built for you.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <Link to="/products" className="btn-primary flex items-center gap-2 text-base">
              <ShoppingBag size={18} />
              Browse Products
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-secondary flex items-center gap-2 text-base">
                Get Started <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card group hover:border-primary-500/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Shop by Category
            </h2>
            <p className="text-white/40">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="card group hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-3xl mb-3">
                  {['📱', '👕', '📚', '🏠', '⚽', '💄'][i]}
                </div>
                <h3 className="font-medium text-white/80 group-hover:text-white transition-colors">{cat}</h3>
                <p className="text-white/30 text-xs mt-1 flex items-center justify-center gap-1 group-hover:text-primary-400 transition-colors">
                  Browse <ArrowRight size={10} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="px-4 py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card border-primary-500/10 bg-gradient-to-br from-primary-500/5 to-transparent">
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Ready to start shopping?
              </h2>
              <p className="text-white/40 mb-8">
                Create your account for free and get access to thousands of products.
              </p>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                Create Free Account <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
