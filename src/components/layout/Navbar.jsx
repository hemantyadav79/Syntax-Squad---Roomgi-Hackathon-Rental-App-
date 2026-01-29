import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Home, Search, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Rental App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/properties" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
              <span>Browse</span>
            </Link>
            
            {user && (
              <Link to="/saved" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-4 h-4" />
                <span>Saved</span>
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="btn-primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/properties"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                <span>Browse Properties</span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/saved"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Saved Properties</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </>
              )}

              <div className="border-t border-border pt-4 mt-2">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full btn-primary">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
