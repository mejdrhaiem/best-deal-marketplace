import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
}

export function ProductCard({ id, name, price, image_url, category }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, image_url });
    toast.success(`${name} added to cart!`);
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <Link to={`/products/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted relative">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <span className="text-4xl text-muted-foreground/30">📦</span>
            </div>
          )}
          {category && (
            <span className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
              {category}
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="font-display font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {price.toFixed(3)} <span className="text-sm font-normal">TND</span>
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
