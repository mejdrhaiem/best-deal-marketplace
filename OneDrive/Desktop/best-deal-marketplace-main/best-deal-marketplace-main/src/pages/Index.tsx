import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import api from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        if (productsRes.data) setFeaturedProducts(productsRes.data.slice(0, 8));
        if (categoriesRes.data) setCategories(categoriesRes.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const features = [
    {
      icon: Tag,
      title: "Best Prices",
      description: "Unbeatable deals on all products",
    },
    {
      icon: Truck,
      title: "Cash on Delivery",
      description: "Pay when you receive your order",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Only the best products for you",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero text-secondary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6 animate-fade-in">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">
                The Best Deals in Tunisia
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Shop Smart, Save Big with{" "}
              <span className="text-gradient">BEST DEAL</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/70 mb-8 animate-fade-in-up">
              Discover amazing products at unbeatable prices. Quality
              guaranteed, delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link to="/products">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground w-full sm:w-auto"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Shop by Category
              </h2>
              <Link to="/products">
                <Button variant="ghost" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl">📦</span>
                  </div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Featured Products
            </h2>
            <Link to="/products">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image_url={product.imageUrl || undefined}
                  category={product.category?.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products available yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon or add some products from the admin dashboard!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Best Deal?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Browse our collection of amazing products and enjoy cash on
              delivery across Tunisia!
            </p>
            <Link to="/products">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
