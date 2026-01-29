import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useProperties } from '@/hooks/useProperties';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { 
  Search, MapPin, Shield, Star, ArrowRight, Home, 
  Building, Users 
} from 'lucide-react';
import { useState } from 'react';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];

const FEATURES = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Verified Listings',
    description: 'All properties are verified by our team for authenticity',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Best Prices',
    description: 'Compare prices and find the best deals in your area',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Prime Locations',
    description: 'Properties near colleges, offices, and transit hubs',
  },
];

const PROPERTY_TYPES = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Private Rooms',
    description: 'Independent rooms with privacy',
    type: 'room',
  },
  {
    icon: <Building className="w-8 h-8" />,
    title: 'PG Accommodation',
    description: 'Paying guest with meals included',
    type: 'pg',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Hostels',
    description: 'Affordable shared accommodation',
    type: 'hostel',
  },
];

export default function Index() {
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();
  const { data: featuredProperties = [], isLoading } = useProperties({ is_available: true });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="font-display text-4xl md:text-6xl font-bold animate-fade-up">
              Find Your Perfect
              <span className="block text-primary mt-2">Stay Near You</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Verified rooms, PGs, and hostels for students and professionals. 
              Transparent pricing, real photos, and trusted listings.
            </p>

            {/* Search Form */}
            <form 
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Enter city or area..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <Button type="submit" size="lg" className="btn-secondary px-8 gap-2">
                  <Search className="w-5 h-5" />
                  Search
                </Button>
              </div>
            </form>

            {/* Quick City Links */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {CITIES.map((city) => (
                <Link
                  key={city}
                  to={`/properties?city=${city}`}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Why Choose StayFinder?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make finding accommodation simple, safe, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div 
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-accent/50 hover:bg-accent transition-colors animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">Browse by Type</h2>
            <p className="text-muted-foreground text-lg">
              Find the perfect accommodation that suits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROPERTY_TYPES.map((type, index) => (
              <Link
                key={type.type}
                to={`/properties?type=${type.type}`}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {type.icon}
                </div>
                <h3 className="font-semibold text-xl mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-heading mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Top-rated accommodations near you</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <PropertyGrid 
            properties={featuredProperties.slice(0, 6)} 
            isLoading={isLoading}
            emptyMessage="No properties available yet. Check back soon!"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Have a Property to List?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of property owners. List your room, PG, or hostel for free and reach verified tenants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/properties">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
