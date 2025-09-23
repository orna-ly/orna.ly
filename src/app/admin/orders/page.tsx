"use client";

import { useAtom } from "jotai";
import { useEffect, useState, useRef, useMemo } from "react";
import { ordersAtom, currentLangAtom, loadOrdersAtom } from "@/lib/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Trash2,
  Download,
  Upload,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/atoms";

interface EditOrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  totalAmount: string;
  wrappingCost: string;
  needsWrapping: boolean;
  paymentMethod: string;
  notes: string;
  status: string;
  paymentStatus: string;
}

interface ImportOrder {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  totalAmount: number;
  wrappingCost: number;
  needsWrapping: boolean;
  paymentMethod: string;
  notes: string;
  status: string;
  paymentStatus: string;
}

export default function AdminOrdersPage() {
  const [orders] = useAtom(ordersAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadOrders] = useAtom(loadOrdersAtom);

  // State for editing
  const [editing, setEditing] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditOrderForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    city: "",
    state: "",
    totalAmount: "",
    wrappingCost: "",
    needsWrapping: false,
    paymentMethod: "",
    notes: "",
    status: "",
    paymentStatus: "",
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // State for CSV import/export
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and paginate orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const updateOrder = async (
    orderId: string,
    data: { status?: string; paymentStatus?: string },
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update order");
      await loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (
      !confirm(
        currentLang === "ar"
          ? "هل أنت متأكد من حذف هذا الطلب؟"
          : "Are you sure you want to delete this order?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete order");
      await loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setForm({
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      customerEmail: order.customerEmail || "",
      address: order.shippingAddress?.address || "",
      city: order.shippingAddress?.city || "",
      state: order.shippingAddress?.state || "",
      totalAmount: String(order.totalAmount || 0),
      wrappingCost: String(order.wrappingCost || 0),
      needsWrapping: order.needsWrapping || false,
      paymentMethod: order.paymentMethod || "",
      notes: order.notes || "",
      status: order.status || "",
      paymentStatus: order.paymentStatus || "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;

    setSaving(true);
    try {
      const updateData = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail,
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
        },
        totalAmount: parseFloat(form.totalAmount),
        wrappingCost: parseFloat(form.wrappingCost),
        needsWrapping: form.needsWrapping,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        status: form.status,
        paymentStatus: form.paymentStatus,
      };

      const res = await fetch(`/api/orders/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update order");

      await loadOrders();
      setEditing(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Address",
      "City",
      "State",
      "Total Amount",
      "Wrapping Cost",
      "Needs Wrapping",
      "Payment Method",
      "Notes",
      "Status",
      "Payment Status",
      "Created At",
    ];

    const csvData = filteredOrders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      order.customerEmail || "",
      order.shippingAddress?.address || "",
      order.shippingAddress?.city || "",
      order.shippingAddress?.state || "",
      order.totalAmount,
      order.wrappingCost || 0,
      order.needsWrapping ? "true" : "false",
      order.paymentMethod || "",
      order.notes || "",
      order.status,
      order.paymentStatus,
      new Date(order.createdAt).toISOString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Import from CSV
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0]
        .split(",")
        .map((h) => h.replace(/"/g, "").trim());

      const importData: ImportOrder[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i]
          .split(",")
          .map((v) => v.replace(/"/g, "").trim());
        if (values.length < headers.length) continue;

        const orderData: ImportOrder = {
          orderNumber: values[0],
          customerName: values[1],
          customerPhone: values[2],
          customerEmail: values[3],
          address: values[4],
          city: values[5],
          state: values[6],
          totalAmount: parseFloat(values[7]) || 0,
          wrappingCost: parseFloat(values[8]) || 0,
          needsWrapping: values[9].toLowerCase() === "true",
          paymentMethod: values[10],
          notes: values[11],
          status: values[12],
          paymentStatus: values[13],
        };

        importData.push(orderData);
      }

      // Send to API for batch creation
      const res = await fetch("/api/orders/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to import orders");

      await loadOrders();
      alert(`Successfully imported ${importData.length} orders`);
    } catch (e) {
      console.error(e);
      alert("Failed to import orders. Please check the file format.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Load orders from backend
  useEffect(() => {
    if (orders.length === 0) {
      void loadOrders();
    }
  }, [orders.length, loadOrders]);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const processingOrders = orders.filter(
    (o) => o.status === "PROCESSING",
  ).length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === "ar" ? "الطلبات الجديدة" : "New Orders"}
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === "ar" ? "قيد المعالجة" : "Processing"}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {processingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === "ar" ? "مكتملة" : "Completed"}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === "ar" ? "إجمالي المبيعات" : "Total Revenue"}
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {formatPrice(totalRevenue, "LYD", currentLang)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters, Search, and Data Management */}
      <Card className="jewelry-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {currentLang === "ar" ? "البحث والفلترة" : "Search & Filters"}
            </CardTitle>

            {/* Data Management Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {currentLang === "ar" ? "إدارة البيانات" : "Data Management"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-neutral-200 shadow-lg"
              >
                <DropdownMenuItem
                  onClick={handleExport}
                  className="gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {currentLang === "ar" ? "تصدير CSV" : "Export CSV"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 cursor-pointer"
                  disabled={importing}
                >
                  <Upload className="h-4 w-4" />
                  {importing
                    ? currentLang === "ar"
                      ? "جاري الاستيراد..."
                      : "Importing..."
                    : currentLang === "ar"
                      ? "استيراد CSV"
                      : "Import CSV"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              style={{ display: "none" }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder={
                    currentLang === "ar"
                      ? "البحث برقم الطلب أو اسم العميل..."
                      : "Search by order number or customer name..."
                  }
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue
                  placeholder={
                    currentLang === "ar" ? "حالة الطلب" : "Order Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {currentLang === "ar" ? "جميع الحالات" : "All Status"}
                </SelectItem>
                <SelectItem value="PENDING">
                  {currentLang === "ar" ? "معلق" : "Pending"}
                </SelectItem>
                <SelectItem value="CONFIRMED">
                  {currentLang === "ar" ? "مؤكد" : "Confirmed"}
                </SelectItem>
                <SelectItem value="PROCESSING">
                  {currentLang === "ar" ? "قيد المعالجة" : "Processing"}
                </SelectItem>
                <SelectItem value="SHIPPED">
                  {currentLang === "ar" ? "تم الشحن" : "Shipped"}
                </SelectItem>
                <SelectItem value="DELIVERED">
                  {currentLang === "ar" ? "تم التوصيل" : "Delivered"}
                </SelectItem>
                <SelectItem value="CANCELLED">
                  {currentLang === "ar" ? "ملغي" : "Cancelled"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue
                  placeholder={
                    currentLang === "ar" ? "حالة الدفع" : "Payment Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {currentLang === "ar" ? "جميع الحالات" : "All Status"}
                </SelectItem>
                <SelectItem value="PAID">
                  {currentLang === "ar" ? "مدفوع" : "Paid"}
                </SelectItem>
                <SelectItem value="PENDING">
                  {currentLang === "ar" ? "معلق" : "Pending"}
                </SelectItem>
                <SelectItem value="FAILED">
                  {currentLang === "ar" ? "فشل" : "Failed"}
                </SelectItem>
                <SelectItem value="REFUNDED">
                  {currentLang === "ar" ? "مستَرد" : "Refunded"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle>
            {currentLang === "ar" ? "جميع الطلبات" : "All Orders"} (
            {filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLang === "ar" ? "رقم الطلب" : "Order ID"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "العميل" : "Customer"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "العناصر" : "Items"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "المبلغ" : "Amount"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "حالة الطلب" : "Status"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "الدفع" : "Payment"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "التاريخ" : "Date"}
                  </TableHead>
                  <TableHead>
                    {currentLang === "ar" ? "الإجراءات" : "Actions"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-neutral-500">
                          {order.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {order.items && order.items.length > 0 ? (
                          <>
                            <div className="font-medium">
                              {order.items[0].product.name[currentLang]}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {currentLang === "ar" ? "الكمية:" : "Qty:"}{" "}
                              {order.items[0].quantity}
                              {order.items.length > 1 && (
                                <span className="ml-2 text-xs">
                                  +{order.items.length - 1}{" "}
                                  {currentLang === "ar" ? "أخرى" : "more"}
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-neutral-500">
                            {currentLang === "ar"
                              ? "لا توجد عناصر"
                              : "No items"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-amber-600">
                        {formatPrice(order.totalAmount, "LYD", currentLang)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(val) =>
                          updateOrder(order.id, { status: val })
                        }
                        defaultValue={order.status}
                      >
                        <SelectTrigger
                          className={`w-32 ${getStatusColor(order.status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">
                            {currentLang === "ar" ? "معلق" : "Pending"}
                          </SelectItem>
                          <SelectItem value="CONFIRMED">
                            {currentLang === "ar" ? "مؤكد" : "Confirmed"}
                          </SelectItem>
                          <SelectItem value="PROCESSING">
                            {currentLang === "ar"
                              ? "قيد المعالجة"
                              : "Processing"}
                          </SelectItem>
                          <SelectItem value="SHIPPED">
                            {currentLang === "ar" ? "تم الشحن" : "Shipped"}
                          </SelectItem>
                          <SelectItem value="DELIVERED">
                            {currentLang === "ar" ? "تم التوصيل" : "Delivered"}
                          </SelectItem>
                          <SelectItem value="CANCELLED">
                            {currentLang === "ar" ? "أُلغي" : "Cancelled"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(val) =>
                          updateOrder(order.id, { paymentStatus: val })
                        }
                        defaultValue={order.paymentStatus}
                      >
                        <SelectTrigger
                          className={`w-28 ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PAID">
                            {currentLang === "ar" ? "مدفوع" : "Paid"}
                          </SelectItem>
                          <SelectItem value="PENDING">
                            {currentLang === "ar" ? "معلق" : "Pending"}
                          </SelectItem>
                          <SelectItem value="FAILED">
                            {currentLang === "ar" ? "فشل" : "Failed"}
                          </SelectItem>
                          <SelectItem value="REFUNDED">
                            {currentLang === "ar" ? "مستَرد" : "Refunded"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString(
                          currentLang === "ar" ? "ar-LY" : "en-LY",
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white border border-neutral-200 shadow-lg"
                        >
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            {currentLang === "ar" ? "عرض" : "View"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEdit(order)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                            {currentLang === "ar" ? "تعديل" : "Edit"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order.id)}
                            className="gap-2 cursor-pointer text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            {currentLang === "ar" ? "حذف" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4">
              <div className="text-sm text-neutral-600">
                {currentLang === "ar"
                  ? `عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredOrders.length,
                    )} من ${filteredOrders.length}`
                  : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      filteredOrders.length,
                    )} of ${filteredOrders.length}`}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentLang === "ar" ? "السابق" : "Previous"}
                </Button>
                <span className="text-sm text-neutral-600">
                  {currentLang === "ar"
                    ? `صفحة ${currentPage} من ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={!hasNextPage}
                >
                  {currentLang === "ar" ? "التالي" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentLang === "ar" ? "تعديل الطلب" : "Edit Order"}:{" "}
              {editing?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                {currentLang === "ar"
                  ? "معلومات العميل"
                  : "Customer Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {currentLang === "ar" ? "اسم العميل" : "Customer Name"}
                  </Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>
                    {currentLang === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </Label>
                  <Input
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerPhone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>
                    {currentLang === "ar" ? "البريد الإلكتروني" : "Email"}
                  </Label>
                  <Input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerEmail: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {currentLang === "ar"
                  ? "معلومات الشحن"
                  : "Shipping Information"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>{currentLang === "ar" ? "العنوان" : "Address"}</Label>
                  <Input
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>{currentLang === "ar" ? "المدينة" : "City"}</Label>
                  <Input
                    value={form.city}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>{currentLang === "ar" ? "المنطقة" : "State"}</Label>
                  <Input
                    value={form.state}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {currentLang === "ar" ? "تفاصيل الطلب" : "Order Details"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    {currentLang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.totalAmount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        totalAmount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>
                    {currentLang === "ar" ? "تكلفة التغليف" : "Wrapping Cost"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.wrappingCost}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        wrappingCost: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needsWrapping"
                      checked={form.needsWrapping}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({
                          ...prev,
                          needsWrapping: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="needsWrapping">
                      {currentLang === "ar" ? "يحتاج تغليف" : "Needs Wrapping"}
                    </Label>
                  </div>
                </div>
                <div>
                  <Label>
                    {currentLang === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </Label>
                  <Select
                    value={form.paymentMethod}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">
                        {currentLang === "ar" ? "بطاقة ائتمان" : "Credit Card"}
                      </SelectItem>
                      <SelectItem value="apple_pay">
                        {currentLang === "ar" ? "آبل باي" : "Apple Pay"}
                      </SelectItem>
                      <SelectItem value="stc_pay">
                        {currentLang === "ar" ? "STC Pay" : "STC Pay"}
                      </SelectItem>
                      <SelectItem value="cod">
                        {currentLang === "ar"
                          ? "الدفع عند الاستلام"
                          : "Cash on Delivery"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>
                    {currentLang === "ar" ? "حالة الطلب" : "Order Status"}
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">
                        {currentLang === "ar" ? "معلق" : "Pending"}
                      </SelectItem>
                      <SelectItem value="CONFIRMED">
                        {currentLang === "ar" ? "مؤكد" : "Confirmed"}
                      </SelectItem>
                      <SelectItem value="PROCESSING">
                        {currentLang === "ar" ? "قيد المعالجة" : "Processing"}
                      </SelectItem>
                      <SelectItem value="SHIPPED">
                        {currentLang === "ar" ? "تم الشحن" : "Shipped"}
                      </SelectItem>
                      <SelectItem value="DELIVERED">
                        {currentLang === "ar" ? "تم التوصيل" : "Delivered"}
                      </SelectItem>
                      <SelectItem value="CANCELLED">
                        {currentLang === "ar" ? "ملغي" : "Cancelled"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>
                    {currentLang === "ar" ? "حالة الدفع" : "Payment Status"}
                  </Label>
                  <Select
                    value={form.paymentStatus}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, paymentStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">
                        {currentLang === "ar" ? "مدفوع" : "Paid"}
                      </SelectItem>
                      <SelectItem value="PENDING">
                        {currentLang === "ar" ? "معلق" : "Pending"}
                      </SelectItem>
                      <SelectItem value="FAILED">
                        {currentLang === "ar" ? "فشل" : "Failed"}
                      </SelectItem>
                      <SelectItem value="REFUNDED">
                        {currentLang === "ar" ? "مستَرد" : "Refunded"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>{currentLang === "ar" ? "ملاحظات" : "Notes"}</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setEditing(null)}>
                {currentLang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button onClick={saveEdit} disabled={saving}>
                {saving
                  ? currentLang === "ar"
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : currentLang === "ar"
                    ? "حفظ التغييرات"
                    : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
