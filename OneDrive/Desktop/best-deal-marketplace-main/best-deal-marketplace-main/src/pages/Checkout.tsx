import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { track, generateEventId } from "@/lib/metaPixel";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePhone = (phone: string) => {
    // Tunisian phone number validation (8 digits, starting with 2, 4, 5, 7, or 9)
    const tunisianPhoneRegex = /^[24579]\d{7}$/;
    return tunisianPhoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error("Please enter a valid Tunisian phone number (8 digits)");
      return;
    }

    setLoading(true);

    try {
      const eventId = generateEventId();
      await api.post("/orders", {
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerNotes: formData.notes,
        totalAmount: getTotalPrice(),
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
        })),
        eventId,
      });

      clearCart();
      setOrderComplete(true);
      toast.success("Order placed successfully!");
      track(
        "Purchase",
        {
          content_ids: items.map((i) => i.id),
          value: getTotalPrice(),
          currency: "TND",
          contents: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            item_price: i.price,
          })),
        },
        eventId
      );
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center animate-fade-in-up">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order! We'll contact you soon to confirm
              delivery details.
            </p>
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Payment Method
              </p>
              <p className="font-semibold text-foreground">
                💵 Cash on Delivery
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="gradient-primary text-primary-foreground"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-xl border border-border/50 p-6"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Delivery Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your Tunisian phone number (8 digits)
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Street address, building, apartment..."
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 min-h-[80px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Tunis, Sfax, Sousse..."
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any special instructions for delivery..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <p className="font-semibold text-foreground mb-2">
                  💵 Payment: Cash on Delivery
                </p>
                <p className="text-sm text-muted-foreground">
                  Pay when you receive your order. No online payment required.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order • ${getTotalPrice().toFixed(3)} TND`
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border/50 p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {(item.price * item.quantity).toFixed(3)} TND
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-border mb-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{getTotalPrice().toFixed(3)} TND</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">
                    {getTotalPrice().toFixed(3)} TND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
