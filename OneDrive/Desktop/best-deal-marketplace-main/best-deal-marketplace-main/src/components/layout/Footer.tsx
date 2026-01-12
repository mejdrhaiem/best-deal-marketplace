import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getConsent, setConsent, init } from '@/lib/metaPixel';
import { useState, useEffect } from 'react';

export function Footer() {
  const [trackingOn, setTrackingOn] = useState<boolean>(getConsent());

  useEffect(() => {
    if (trackingOn) init();
  }, [trackingOn]);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="gradient-primary rounded-lg px-3 py-1.5">
                <span className="font-display text-xl font-bold text-primary-foreground">BEST</span>
              </div>
              <span className="font-display text-xl font-bold text-secondary-foreground">DEAL</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm">
              Your one-stop shop for the best deals in Tunisia. Quality products at unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                +216 XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Tunisia
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                contact@bestdeal.tn
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-secondary-foreground/50 text-sm">
            © {new Date().getFullYear()} BEST DEAL. All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs text-secondary-foreground/60">Tracking</span>
            <Switch
              checked={trackingOn}
              onCheckedChange={(checked) => {
                setConsent(checked);
                setTrackingOn(checked);
              }}
            />
            <span className="text-xs text-secondary-foreground/60">{trackingOn ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
