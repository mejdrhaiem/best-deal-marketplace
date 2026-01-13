import { useEffect, useState } from "react";
import { Eye, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminLayout } from "@/components/admin/AdminLayout";
import api from "@/lib/api";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string | null;
  customerNotes: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    value: "on_delivery",
    label: "On Delivery",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-success/10 text-success",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-destructive/10 text-destructive",
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data } = await api.get("/orders");
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast.success("Order status updated");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "An error occurred");
    }
  }

  const getStatusStyle = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color ||
      "bg-muted text-muted-foreground"
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerFirstName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.customerLastName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order.customerPhone || "").includes(search);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.customerFirstName} {order.customerLastName}
                    </TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell className="font-bold text-primary">
                      {Number(order.totalAmount).toFixed(3)} TND
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[130px] ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Customer Information
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {selectedOrder.customerFirstName}{" "}
                      {selectedOrder.customerLastName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {selectedOrder.customerPhone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Address:</span>{" "}
                      {selectedOrder.customerAddress}
                    </p>
                    {selectedOrder.customerCity && (
                      <p>
                        <span className="text-muted-foreground">City:</span>{" "}
                        {selectedOrder.customerCity}
                      </p>
                    )}
                    {selectedOrder.customerNotes && (
                      <p>
                        <span className="text-muted-foreground">Notes:</span>{" "}
                        {selectedOrder.customerNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-muted/50 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {Number(item.productPrice).toFixed(3)} TND ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">
                          {(Number(item.productPrice) * item.quantity).toFixed(
                            3
                          )}{" "}
                          TND
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">
                    {Number(selectedOrder.totalAmount).toFixed(3)} TND
                  </span>
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Update Status
                  </h3>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      updateOrderStatus(selectedOrder.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
