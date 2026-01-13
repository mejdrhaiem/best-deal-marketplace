import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import api from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { track, generateEventId } from "@/lib/metaPixel";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category?: { name: string } | null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) return;
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      track("ViewContent", {
        content_ids: [product.id],
        value: Number(product.price),
        currency: "TND",
      });
    }
  }, [product]);
  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.imageUrl || undefined,
    });
    const eventId = generateEventId();
    track(
      "AddToCart",
      {
        content_ids: [product.id],
        value: Number(product.price),
        currency: "TND",
        contents: [
          { id: product.id, quantity: 1, item_price: Number(product.price) },
        ],
      },
      eventId
    );
    api
      .post("/track/add-to-cart", {
        eventId,
        contents: [
          { id: product.id, quantity: 1, item_price: Number(product.price) },
        ],
        value: Number(product.price),
        currency: "TND",
      })
      .catch(() => {});
  };

  return (
    <Layout>
      <div className="container py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : !product ? (
          <div className="text-center py-20 text-muted-foreground">
            Product not found
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
              <div className="aspect-square bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">📦</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              {product.category?.name && (
                <p className="text-sm text-muted-foreground">
                  Category: {product.category.name}
                </p>
              )}
              <p className="text-lg text-muted-foreground">
                {product.description || "No description provided."}
              </p>
              <p className="text-2xl font-bold text-primary">
                {Number(product.price).toFixed(3)} TND
              </p>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
