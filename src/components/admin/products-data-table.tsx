"use client";

import { useAtom } from "jotai";
import { currentLangAtom, type Product, loadProductsAtom } from "@/lib/atoms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  TrendingUp,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductsDataTableProps {
  products: Product[];
}

export function ProductsDataTable({ products }: ProductsDataTableProps) {
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadProducts] = useAtom(loadProductsAtom);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  interface EditForm {
    price: string;
    priceBeforeDiscount: string;
    wrappingPrice: string;
    stockQuantity: string;
    featured: boolean;
    status: string;
    images: string;
  }

  const [form, setForm] = useState<EditForm>({
    price: "",
    priceBeforeDiscount: "",
    wrappingPrice: "",
    stockQuantity: "",
    featured: false,
    status: "ACTIVE",
    images: "",
  });

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      price: String(p.price ?? ""),
      priceBeforeDiscount:
        p.priceBeforeDiscount != null ? String(p.priceBeforeDiscount) : "",
      wrappingPrice: p.wrappingPrice != null ? String(p.wrappingPrice) : "",
      stockQuantity:
        typeof (p as Product & { stockQuantity?: number }).stockQuantity !==
          "undefined" &&
        (p as Product & { stockQuantity?: number }).stockQuantity !== null
          ? String((p as Product & { stockQuantity?: number }).stockQuantity)
          : "0",
      featured: p.featured,
      status: p.status,
      images: (p.images || []).join(", "),
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body: {
        price: number;
        priceBeforeDiscount?: number;
        wrappingPrice?: number;
        stockQuantity: number;
        featured: boolean;
        status: string;
        images: string[];
      } = {
        price: parseFloat(form.price || "0"),
        priceBeforeDiscount: form.priceBeforeDiscount
          ? parseFloat(form.priceBeforeDiscount)
          : undefined,
        wrappingPrice: form.wrappingPrice
          ? parseFloat(form.wrappingPrice)
          : undefined,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        featured: form.featured,
        status: form.status,
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save");
      setEditing(null);
      await loadProducts();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    // You could add a toast notification here
  };

  const handleDelete = async (productId: string) => {
    if (
      !confirm(
        currentLang === "ar" ? "تأكيد حذف المنتج؟" : "Delete this product?",
      )
    )
      return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {currentLang === "ar" ? "لا توجد منتجات" : "No products found"}
        </h3>
        <p className="text-neutral-600">
          {currentLang === "ar"
            ? "ابدأ بإضافة منتجات جديدة إلى متجرك"
            : "Start by adding new products to your store"}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">
              {currentLang === "ar" ? "صورة" : "Image"}
            </TableHead>
            <TableHead>{currentLang === "ar" ? "الاسم" : "Name"}</TableHead>
            <TableHead>{currentLang === "ar" ? "السعر" : "Price"}</TableHead>
            <TableHead>{currentLang === "ar" ? "الحالة" : "Status"}</TableHead>
            <TableHead>
              {currentLang === "ar" ? "تاريخ الإنشاء" : "Created"}
            </TableHead>
            <TableHead className="w-20">
              {currentLang === "ar" ? "الإجراءات" : "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-neutral-50">
              <TableCell>
                <div className="relative w-12 h-12">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name[currentLang]}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 rounded-md flex items-center justify-center">
                      <span className="text-xl">💍</span>
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <div className="font-medium">{product.name[currentLang]}</div>
                  <div className="text-sm text-neutral-500">{product.slug}</div>
                  {product.subtitle && (
                    <div className="text-sm text-neutral-600 mt-1">
                      {product.subtitle[currentLang]}
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <div className="font-medium">
                    {new Intl.NumberFormat(
                      currentLang === "ar" ? "ar-LY" : "en-LY",
                    ).format(product.price)}{" "}
                    {currentLang === "ar" ? "د.ل" : "LYD"}
                  </div>
                  {product.priceBeforeDiscount && (
                    <div className="text-sm text-neutral-500 line-through">
                      {new Intl.NumberFormat(
                        currentLang === "ar" ? "ar-LY" : "en-LY",
                      ).format(product.priceBeforeDiscount)}{" "}
                      {currentLang === "ar" ? "د.ل" : "LYD"}
                    </div>
                  )}
                  {product.priceBeforeDiscount && (
                    <div className="text-xs text-green-600 font-medium">
                      {Math.round(
                        ((product.priceBeforeDiscount - product.price) /
                          product.priceBeforeDiscount) *
                          100,
                      )}
                      % OFF
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <Badge variant={product.featured ? "default" : "secondary"}>
                    {product.featured
                      ? currentLang === "ar"
                        ? "مميز"
                        : "Featured"
                      : currentLang === "ar"
                        ? "عادي"
                        : "Regular"}
                  </Badge>
                  {product.priceBeforeDiscount && (
                    <Badge variant="outline" className="text-xs">
                      {currentLang === "ar" ? "خصم" : "Sale"}
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">
                  {new Date(product.createdAt).toLocaleDateString(
                    currentLang === "ar" ? "ar-SA" : "en-US",
                  )}
                </div>
                <div className="text-xs text-neutral-500">
                  {new Date(product.createdAt).toLocaleTimeString(
                    currentLang === "ar" ? "ar-SA" : "en-US",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </div>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white border border-neutral-200 shadow-lg"
                  >
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.slug}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        {currentLang === "ar" ? "عرض" : "View"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {currentLang === "ar" ? "تعديل" : "Edit"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyId(product.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      {currentLang === "ar" ? "نسخ المعرف" : "Copy ID"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {currentLang === "ar" ? "حذف" : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Product Dialog */}
      {editing && (
        <Dialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        >
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="gradient-text-gold">
                {currentLang === "ar" ? "تعديل المنتج" : "Edit Product"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Pricing Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  {currentLang === "ar" ? "التسعير" : "Pricing"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price" className="text-sm font-medium">
                      {currentLang === "ar"
                        ? "السعر الحالي (د.ل)"
                        : "Current Price (LYD)"}
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f: EditForm) => ({
                          ...f,
                          price: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-price-before"
                      className="text-sm font-medium"
                    >
                      {currentLang === "ar"
                        ? "السعر قبل الخصم (د.ل)"
                        : "Price Before Discount (LYD)"}
                    </Label>
                    <Input
                      id="edit-price-before"
                      type="number"
                      step="0.01"
                      value={form.priceBeforeDiscount}
                      onChange={(e) =>
                        setForm((f: EditForm) => ({
                          ...f,
                          priceBeforeDiscount: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-wrapping"
                      className="text-sm font-medium"
                    >
                      {currentLang === "ar"
                        ? "سعر التغليف (د.ل)"
                        : "Gift Wrapping (LYD)"}
                    </Label>
                    <Input
                      id="edit-wrapping"
                      type="number"
                      step="0.01"
                      value={form.wrappingPrice}
                      onChange={(e) =>
                        setForm((f: EditForm) => ({
                          ...f,
                          wrappingPrice: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-stock" className="text-sm font-medium">
                      {currentLang === "ar"
                        ? "الكمية المتوفرة"
                        : "Stock Quantity"}
                    </Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={form.stockQuantity}
                      onChange={(e) =>
                        setForm((f: EditForm) => ({
                          ...f,
                          stockQuantity: e.target.value,
                        }))
                      }
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Discount Calculation */}
                {form.priceBeforeDiscount &&
                  form.price &&
                  parseFloat(form.priceBeforeDiscount) >
                    parseFloat(form.price) && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-700">
                          {currentLang === "ar" ? "نسبة الخصم:" : "Discount:"}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {Math.round(
                            ((parseFloat(form.priceBeforeDiscount) -
                              parseFloat(form.price)) /
                              parseFloat(form.priceBeforeDiscount)) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {currentLang === "ar"
                          ? `توفير ${(
                              parseFloat(form.priceBeforeDiscount) -
                              parseFloat(form.price)
                            ).toFixed(2)} د.ل`
                          : `Save ${(
                              parseFloat(form.priceBeforeDiscount) -
                              parseFloat(form.price)
                            ).toFixed(2)} LYD`}
                      </div>
                    </div>
                  )}
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  {currentLang === "ar" ? "الإعدادات" : "Settings"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {currentLang === "ar" ? "حالة المنتج" : "Product Status"}
                    </Label>
                    <Select
                      value={form.status}
                      onValueChange={(v: string) =>
                        setForm((f: EditForm) => ({ ...f, status: v }))
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="ACTIVE">
                          {currentLang === "ar" ? "نشط" : "Active"}
                        </SelectItem>
                        <SelectItem value="INACTIVE">
                          {currentLang === "ar" ? "غير نشط" : "Inactive"}
                        </SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                          {currentLang === "ar"
                            ? "نفد المخزون"
                            : "Out of Stock"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {currentLang === "ar"
                        ? "خيارات العرض"
                        : "Display Options"}
                    </Label>
                    <div className="flex items-center space-x-3 h-11 px-3 border rounded-md bg-neutral-50">
                      <Checkbox
                        id="edit-featured"
                        checked={form.featured}
                        onCheckedChange={(checked: boolean) =>
                          setForm((f: EditForm) => ({
                            ...f,
                            featured: !!checked,
                          }))
                        }
                      />
                      <Label
                        htmlFor="edit-featured"
                        className="text-sm cursor-pointer"
                      >
                        {currentLang === "ar"
                          ? "منتج مميز"
                          : "Featured Product"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  {currentLang === "ar" ? "الصور" : "Images"}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="edit-images" className="text-sm font-medium">
                    {currentLang === "ar" ? "روابط الصور" : "Image URLs"}
                  </Label>
                  <Textarea
                    id="edit-images"
                    value={form.images}
                    onChange={(e) =>
                      setForm((f: EditForm) => ({
                        ...f,
                        images: e.target.value,
                      }))
                    }
                    placeholder={
                      currentLang === "ar"
                        ? "افصل بين الروابط بفواصل"
                        : "Separate URLs with commas"
                    }
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setEditing(null)}>
                {currentLang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={saveEdit}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 min-w-[120px]"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {currentLang === "ar" ? "جاري الحفظ..." : "Saving..."}
                  </div>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    {currentLang === "ar" ? "حفظ التغييرات" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination */}
      {products.length > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            {currentLang === "ar"
              ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(
                  currentPage * itemsPerPage,
                  products.length,
                )} من ${products.length} منتج`
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                  currentPage * itemsPerPage,
                  products.length,
                )} of ${products.length} products`}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={!hasPrevPage}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={!hasNextPage}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
