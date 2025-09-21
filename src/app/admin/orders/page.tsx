"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { ordersAtom, currentLangAtom, loadOrdersAtom } from "@/lib/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders] = useAtom(ordersAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadOrders] = useAtom(loadOrdersAtom);

  // Load orders from backend
  useEffect(() => {
    if (orders.length === 0) {
      void loadOrders();
    }
  }, [orders.length, loadOrders]);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const processingOrders = orders.filter(
    (o) => o.status === "PROCESSING"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "PROCESSING":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "CANCELLED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
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

      {/* Filters and Search */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {currentLang === "ar" ? "البحث والفلترة" : "Search & Filters"}
          </CardTitle>
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
                />
              </div>
            </div>
            <Select>
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
                <SelectItem value="PROCESSING">
                  {currentLang === "ar" ? "قيد المعالجة" : "Processing"}
                </SelectItem>
                <SelectItem value="SHIPPED">
                  {currentLang === "ar" ? "تم الشحن" : "Shipped"}
                </SelectItem>
                <SelectItem value="DELIVERED">
                  {currentLang === "ar" ? "تم التوصيل" : "Delivered"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle>
            {currentLang === "ar" ? "جميع الطلبات" : "All Orders"}
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
                {orders.map((order) => (
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
                              {currentLang === "ar" ? "الكمية:" : "Qty:"} {order.items[0].quantity}
                              {order.items.length > 1 && (
                                <span className="ml-2 text-xs">+{order.items.length - 1} {currentLang === 'ar' ? 'أخرى' : 'more'}</span>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-neutral-500">{currentLang === 'ar' ? 'لا توجد عناصر' : 'No items'}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-amber-600">
                        {formatPrice(order.totalAmount, "LYD", currentLang)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status === "PENDING" &&
                          (currentLang === "ar" ? "معلق" : "Pending")}
                        {order.status === "PROCESSING" &&
                          (currentLang === "ar"
                            ? "قيد المعالجة"
                            : "Processing")}
                        {order.status === "SHIPPED" &&
                          (currentLang === "ar" ? "تم الشحن" : "Shipped")}
                        {order.status === "DELIVERED" &&
                          (currentLang === "ar" ? "تم التوصيل" : "Delivered")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPaymentStatusColor(order.paymentStatus)}
                      >
                        {order.paymentStatus === "PAID" &&
                          (currentLang === "ar" ? "مدفوع" : "Paid")}
                        {order.paymentStatus === "PENDING" &&
                          (currentLang === "ar" ? "معلق" : "Pending")}
                        {order.paymentStatus === "FAILED" &&
                          (currentLang === "ar" ? "فشل" : "Failed")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString(
                          currentLang === "ar" ? "ar-LY" : "en-LY"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
