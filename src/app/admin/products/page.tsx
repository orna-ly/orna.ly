"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  productsAtom,
  currentLangAtom,
  loadProductsAtom,
  type Product,
} from "@/lib/atoms";
import { ProductsDataTable } from "@/components/admin/products-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Package,
  Star,
  TrendingUp,
  AlertTriangle,
  Upload,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreateProductForm {
  nameAr: string;
  nameEn: string;
  slug: string;
  price: string;
  priceBeforeDiscount: string;
  wrappingPrice: string;
  stockQuantity: string;
  images: string;
  featured: boolean;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface ImportProduct {
  name?: { ar?: string; en?: string };
  slug?: string;
  price?: number;
  priceBeforeDiscount?: number;
  wrappingPrice?: number;
  stockQuantity?: number;
  featured?: boolean;
  status?: string;
  images?: string[];
  subtitle?: { ar?: string; en?: string };
  description?: { ar?: string; en?: string };
}

export default function AdminProductsPage() {
  const [products] = useAtom(productsAtom);
  const [currentLang] = useAtom(currentLangAtom);
  const [, loadProducts] = useAtom(loadProductsAtom);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CreateProductForm>({
    nameAr: "",
    nameEn: "",
    slug: "",
    price: "",
    priceBeforeDiscount: "",
    wrappingPrice: "",
    stockQuantity: "",
    images: "",
    featured: false,
    subtitleAr: "",
    subtitleEn: "",
    descriptionAr: "",
    descriptionEn: "",
  });

  // Load products from backend
  useEffect(() => {
    if (products.length === 0) {
      void loadProducts();
    }
    // open create dialog if ?create=1
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("create") === "1") setOpen(true);
    } catch {}
  }, [products.length, loadProducts]);

  // Export products to CSV
  const handleExport = () => {
    const headers = [
      "ID",
      "Name (AR)",
      "Name (EN)",
      "Slug",
      "Price",
      "Price Before Discount",
      "Wrapping Price",
      "Stock Quantity",
      "Featured",
      "Status",
      "Images",
      "Subtitle (AR)",
      "Subtitle (EN)",
      "Description (AR)",
      "Description (EN)",
    ];

    const csvData = products.map((p) => [
      p.id,
      p.name.ar || "",
      p.name.en || "",
      p.slug,
      p.price,
      p.priceBeforeDiscount || "",
      p.wrappingPrice || "",
      (p as Product & { stockQuantity?: number }).stockQuantity || 0,
      p.featured ? "true" : "false",
      p.status,
      (p.images || []).join(";"),
      p.subtitle?.ar || "",
      p.subtitle?.en || "",
      p.description?.ar || "",
      p.description?.en || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Import products from CSV
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""));

      const importData = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.replace(/"/g, ""));
        const product: ImportProduct = {};
        headers.forEach((header, index) => {
          const value = values[index] || "";
          switch (header) {
            case "Name (AR)":
              if (!product.name) product.name = {};
              product.name.ar = value;
              break;
            case "Name (EN)":
              if (!product.name) product.name = {};
              product.name.en = value;
              break;
            case "Slug":
              product.slug = value;
              break;
            case "Price":
              product.price = parseFloat(value) || 0;
              break;
            case "Price Before Discount":
              product.priceBeforeDiscount = value
                ? parseFloat(value)
                : undefined;
              break;
            case "Wrapping Price":
              product.wrappingPrice = value ? parseFloat(value) : undefined;
              break;
            case "Stock Quantity":
              product.stockQuantity = parseInt(value) || 0;
              break;
            case "Featured":
              product.featured = value.toLowerCase() === "true";
              break;
            case "Status":
              product.status = value || "ACTIVE";
              break;
            case "Images":
              product.images = value ? value.split(";") : [];
              break;
            case "Subtitle (AR)":
              if (!product.subtitle) product.subtitle = {};
              product.subtitle.ar = value;
              break;
            case "Subtitle (EN)":
              if (!product.subtitle) product.subtitle = {};
              product.subtitle.en = value;
              break;
            case "Description (AR)":
              if (!product.description) product.description = {};
              product.description.ar = value;
              break;
            case "Description (EN)":
              if (!product.description) product.description = {};
              product.description.en = value;
              break;
          }
        });
        return product;
      });

      // Send batch create request
      const res = await fetch("/api/products/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: importData }),
      });

      if (!res.ok) throw new Error("Failed to import products");

      await loadProducts();
      alert(
        currentLang === "ar"
          ? `تم استيراد ${importData.length} منتج بنجاح`
          : `Successfully imported ${importData.length} products`,
      );
    } catch (error) {
      console.error("Import error:", error);
      alert(
        currentLang === "ar"
          ? "حدث خطأ أثناء الاستيراد"
          : "Error occurred during import",
      );
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const body = {
        name: { ar: form.nameAr, en: form.nameEn },
        slug: form.slug,
        price: parseFloat(form.price || "0"),
        priceBeforeDiscount: form.priceBeforeDiscount
          ? parseFloat(form.priceBeforeDiscount)
          : undefined,
        wrappingPrice: form.wrappingPrice
          ? parseFloat(form.wrappingPrice)
          : undefined,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        featured: form.featured,
        subtitle: { ar: form.subtitleAr, en: form.subtitleEn },
        description: { ar: form.descriptionAr, en: form.descriptionEn },
        status: "ACTIVE",
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create product");
      setOpen(false);
      setForm({
        nameAr: "",
        nameEn: "",
        slug: "",
        price: "",
        priceBeforeDiscount: "",
        wrappingPrice: "",
        stockQuantity: "",
        images: "",
        featured: false,
        subtitleAr: "",
        subtitleEn: "",
        descriptionAr: "",
        descriptionEn: "",
      });
      // refresh list
      await loadProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const featuredCount = products.filter((p) => p.featured).length;
  const averagePrice =
    products.length > 0
      ? Math.round(
          products.reduce((sum, p) => sum + p.price, 0) / products.length,
        )
      : 0;
  const discountedCount = products.filter((p) => p.priceBeforeDiscount).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentLang === "ar" ? "إدارة المنتجات" : "Product Management"}
          </h1>
          <p className="text-neutral-600 mt-2">
            {currentLang === "ar"
              ? "إدارة مجموعة المنتجات والمجوهرات"
              : "Manage your jewelry collection and products"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".csv"
            className="hidden"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {currentLang === "ar" ? "إدارة البيانات" : "Data Management"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                {currentLang === "ar" ? "تصدير CSV" : "Export CSV"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing
                  ? currentLang === "ar"
                    ? "جار الاستيراد..."
                    : "Importing..."
                  : currentLang === "ar"
                    ? "استيراد CSV"
                    : "Import CSV"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                {currentLang === "ar" ? "منتج جديد" : "New Product"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {currentLang === "ar"
                    ? "إضافة منتج جديد"
                    : "Create New Product"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder={
                      currentLang === "ar" ? "الاسم (عربي)" : "Name (AR)"
                    }
                    value={form.nameAr}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        nameAr: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Name (EN)"
                    value={form.nameEn}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        nameEn: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        slug: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder={currentLang === "ar" ? "السعر" : "Price"}
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        price: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder={
                      currentLang === "ar"
                        ? "السعر قبل الخصم"
                        : "Price Before Discount"
                    }
                    type="number"
                    value={form.priceBeforeDiscount}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        priceBeforeDiscount: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder={
                      currentLang === "ar" ? "سعر التغليف" : "Wrapping Price"
                    }
                    type="number"
                    value={form.wrappingPrice}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        wrappingPrice: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder={
                      currentLang === "ar"
                        ? "الكمية بالمخزون"
                        : "Stock Quantity"
                    }
                    type="number"
                    value={form.stockQuantity}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        stockQuantity: e.target.value,
                      }))
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={form.featured}
                      onCheckedChange={(checked: boolean) =>
                        setForm((f: CreateProductForm) => ({
                          ...f,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="featured">
                      {currentLang === "ar" ? "منتج مميز" : "Featured"}
                    </Label>
                  </div>
                </div>
                <Input
                  placeholder={
                    currentLang === "ar"
                      ? "روابط الصور (مفصولة بفواصل)"
                      : "Image URLs (comma-separated)"
                  }
                  value={form.images}
                  onChange={(e) =>
                    setForm((f: CreateProductForm) => ({
                      ...f,
                      images: e.target.value,
                    }))
                  }
                  className="col-span-2"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder={
                      currentLang === "ar"
                        ? "العنوان الفرعي (عربي)"
                        : "Subtitle (AR)"
                    }
                    value={form.subtitleAr}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        subtitleAr: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Subtitle (EN)"
                    value={form.subtitleEn}
                    onChange={(e) =>
                      setForm((f: CreateProductForm) => ({
                        ...f,
                        subtitleEn: e.target.value,
                      }))
                    }
                  />
                </div>
                <Textarea
                  placeholder={
                    currentLang === "ar" ? "الوصف (عربي)" : "Description (AR)"
                  }
                  value={form.descriptionAr}
                  onChange={(e) =>
                    setForm((f: CreateProductForm) => ({
                      ...f,
                      descriptionAr: e.target.value,
                    }))
                  }
                />
                <Textarea
                  placeholder="Description (EN)"
                  value={form.descriptionEn}
                  onChange={(e) =>
                    setForm((f: CreateProductForm) => ({
                      ...f,
                      descriptionEn: e.target.value,
                    }))
                  }
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    {currentLang === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {creating
                      ? currentLang === "ar"
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : currentLang === "ar"
                        ? "حفظ"
                        : "Save"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === "ar" ? "إجمالي المنتجات" : "Total Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{products.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === "ar" ? "المنتجات المميزة" : "Featured Products"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold">{featuredCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === "ar" ? "متوسط السعر" : "Average Price"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {formatPrice(averagePrice, "LYD", currentLang)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">
              {currentLang === "ar" ? "منتجات بخصم" : "Discounted Items"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{discountedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {currentLang === "ar" ? "جميع المنتجات" : "All Products"}
            </span>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {currentLang === "ar" ? "تصدير CSV" : "Export CSV"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsDataTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
