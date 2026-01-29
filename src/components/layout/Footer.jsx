import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">StayFinder</span>
            </Link>
            <p className="text-muted-foreground/80 max-w-md">
              Find verified rental rooms, PGs, and hostels near your college or workplace. 
              Transparent pricing, real photos, and trusted listings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground/80">
              <li><Link to="/properties" className="hover:text-background transition-colors">Browse Properties</Link></li>
              <li><Link to="/auth" className="hover:text-background transition-colors">Sign In</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-background transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-muted-foreground/80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@stayfinder.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground/60">
          <p>&copy; {new Date().getFullYear()} StayFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
