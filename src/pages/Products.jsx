import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Search, Filter, Loader, Package } from 'lucide-react';
import { productAPI } from '../services/api';
import { addToCart } from '../store/store';
import toast from 'react-hot-toast';

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty'];

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="card group hover:border-primary-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-dark-700 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <Package size={40} className="text-white/10" />
        )}
        <div className="absolute top-3 right-3">
          <span className={`badge text-xs ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <span className="badge bg-primary-500/10 text-primary-400 mb-2 self-start">{product.category}</span>
        <h3 className="font-display font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-white/40 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-primary-400">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white border border-primary-500/20 hover:border-transparent px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Products</h1>
        <p className="text-white/40">{filtered.length} products available</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={16} className="text-white/30 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-white/50 hover:text-white hover:bg-dark-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <Loader size={32} className="animate-spin text-primary-500" />
            <p className="text-white/40">Loading products...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32">
          <Package size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No products found</p>
          <p className="text-white/20 text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
