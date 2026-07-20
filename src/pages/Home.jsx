import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CakeCard from '../components/CakeCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Chocolate', 'Fruit & Berries', 'Classic Bakes', 'Vegan & Healthy', 'Caramel & Crunch'];

export default function Home({ onSelectCake, searchQuery }) {
  const { cakes } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Filter and Search logic
  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      const matchesCategory = selectedCategory === 'All' || cake.category === selectedCategory;
      const finalSearch = (searchQuery || localSearch).toLowerCase();
      const matchesSearch = cake.name.toLowerCase().includes(finalSearch) || 
                            cake.description.toLowerCase().includes(finalSearch) ||
                            cake.seller_name.toLowerCase().includes(finalSearch);
      const matchesRating = cake.rating >= minRating;
      return matchesCategory && matchesSearch && matchesRating;
    });
  }, [cakes, selectedCategory, localSearch, searchQuery, minRating]);

  // Extract special sales (cakes with discounts)
  const specialSales = useMemo(() => {
    return cakes.filter(cake => cake.discount > 0);
  }, [cakes]);

  // Extract highly rated cakes (rating >= 4.8)
  const topRated = useMemo(() => {
    return [...cakes].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [cakes]);

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      
      {/* Hero Section */}
      <section className="glass" style={{
        padding: '60px 40px',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '60px',
        textAlign: 'center',
        background: 'var(--hero-bg)',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blur elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-secondary" style={{ marginBottom: '16px', display: 'inline-flex', gap: '6px' }}>
            <Sparkles size={14} /> Local Sellers & Bakers Platform
          </span>
          <h1 style={{
            fontSize: '3.2rem',
            lineHeight: 1.1,
            marginBottom: '16px',
            background: 'var(--hero-title-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}>
            Craving Happiness?<br />Order Cakes Local.
          </h1>
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            color: 'var(--hero-subtext-color)'
          }}>
            Explore premium homemade pastries and custom cakes listed by local baking chefs. 100% Cash on Delivery, delivered fresh to your door.
          </p>

          {/* Large Hero Search bar */}
          <div className="flex-center" style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search cakes, flavors, bakers..." 
              value={searchQuery || localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="form-input"
              style={{
                padding: '16px 24px 16px 50px',
                borderRadius: '50px',
                fontSize: '1.05rem',
                border: '1.5px solid var(--input-border)',
                backgroundColor: 'var(--input-bg)'
              }}
            />
            <span style={{ position: 'absolute', left: '20px', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </span>
          </div>
        </div>
      </section>

      {/* Special Sales Slider */}
      {specialSales.length > 0 && (
        <section style={{ marginBottom: '60px' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>%</span> Special Discounts & Offers
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Limited Time Bakes</span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {specialSales.map(cake => (
              <CakeCard key={cake.id} cake={cake} onSelect={onSelectCake} />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated Cakes Section */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2>⭐ Most Highly Rated Cakes</h2>
          <p style={{ fontSize: '0.95rem' }}>The absolute favorites voted by our community.</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {topRated.map(cake => (
            <CakeCard key={cake.id} cake={cake} onSelect={onSelectCake} />
          ))}
        </div>
      </section>

      {/* Main Browse Catalog Section */}
      <section style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '60px' }}>
        <div className="flex-between" style={{ marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2>🍰 Browse Full Cake Catalog</h2>
            <p style={{ fontSize: '0.95rem' }}>Select categories and sort options to find your perfect flavor.</p>
          </div>

          {/* Filters controls */}
          <div className="flex-center gap-md" style={{ flexWrap: 'wrap' }}>
            <SlidersHorizontal size={18} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="form-select"
              style={{ padding: '8px 16px', borderRadius: '50px', background: 'var(--bg-card)', minWidth: '150px' }}
            >
              <option value="0">All Ratings</option>
              <option value="4.5">★ 4.5 & up</option>
              <option value="4.8">★ 4.8 & up</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '32px'
        }} className="hide-scrollbar">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-text'}`}
              style={{
                borderRadius: '50px',
                padding: '8px 20px',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                border: selectedCategory === category ? 'none' : '1px solid var(--bg-card-border)'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Products Grid */}
        {filteredCakes.length > 0 ? (
          <div className="grid-3">
            {filteredCakes.map(cake => (
              <CakeCard key={cake.id} cake={cake} onSelect={onSelectCake} />
            ))}
          </div>
        ) : (
          <div className="glass flex-center" style={{
            flexDirection: 'column',
            padding: '80px 40px',
            textAlign: 'center',
            gap: '16px',
            borderRadius: 'var(--radius-lg)'
          }}>
            <span style={{ fontSize: '3rem' }}>🧁</span>
            <h3>No cakes found</h3>
            <p>We couldn't find any cakes matching your search criteria. Try adjusting your filters!</p>
            <button onClick={() => { setSelectedCategory('All'); setLocalSearch(''); setMinRating(0); }} className="btn btn-outline">
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
