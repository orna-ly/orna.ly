'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { 
  productsAtom, 
  ordersAtom, 
  contactsAtom, 
  currentLangAtom 
} from '@/lib/atoms'
import { mockProducts, mockOrders, mockContacts } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  ShoppingBag, 
  Mail, 
  TrendingUp, 
  Users,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useAtom(productsAtom)
  const [orders, setOrders] = useAtom(ordersAtom)
  const [contacts, setContacts] = useAtom(contactsAtom)
  const [currentLang] = useAtom(currentLangAtom)

  // Initialize data
  useEffect(() => {
    if (products.length === 0) setProducts(mockProducts)
    if (orders.length === 0) setOrders(mockOrders)
    if (contacts.length === 0) setContacts(mockContacts)
  }, [products.length, orders.length, contacts.length, setProducts, setOrders, setContacts])

  // Calculate stats
  const totalProducts = products.length
  const featuredProducts = products.filter(p => p.featured).length
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'NEW').length
  const processingOrders = orders.filter(o => o.status === 'PROCESSING').length
  const totalContacts = contacts.length
  const newContacts = contacts.filter(c => c.status === 'NEW').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const stats = [
    {
      title: { ar: 'إجمالي المنتجات', en: 'Total Products' },
      value: totalProducts,
      icon: Package,
      change: '+12%',
      changeType: 'increase' as const,
      color: 'amber'
    },
    {
      title: { ar: 'إجمالي الطلبات', en: 'Total Orders' },
      value: totalOrders,
      icon: ShoppingBag,
      change: '+8%',
      changeType: 'increase' as const,
      color: 'blue'
    },
    {
      title: { ar: 'الرسائل الجديدة', en: 'New Messages' },
      value: newContacts,
      icon: Mail,
      change: '+2',
      changeType: 'increase' as const,
      color: 'green'
    },
    {
      title: { ar: 'إجمالي الإيرادات', en: 'Total Revenue' },
      value: `${totalRevenue.toLocaleString()} ${currentLang === 'ar' ? 'ر.س' : 'SAR'}`,
      icon: TrendingUp,
      change: '+15%',
      changeType: 'increase' as const,
      color: 'purple'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      amber: 'bg-amber-100 text-amber-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    }
    return colors[color as keyof typeof colors] || colors.amber
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      {stat.title[currentLang as keyof typeof stat.title]}
                    </p>
                    <p className="text-2xl font-bold text-neutral-900 mt-2">
                      {stat.value}
                    </p>
                    <p className={`text-sm mt-2 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} {currentLang === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {currentLang === 'ar' ? 'الطلبات الأخيرة' : 'Recent Orders'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {order.totalAmount} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                    </p>
                    <div className="flex items-center gap-1">
                      {order.status === 'NEW' && <AlertCircle className="h-3 w-3 text-orange-500" />}
                      {order.status === 'PROCESSING' && <CheckCircle className="h-3 w-3 text-blue-500" />}
                      <span className={`text-xs ${
                        order.status === 'NEW' ? 'text-orange-600' :
                        order.status === 'PROCESSING' ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {order.status === 'NEW' && (currentLang === 'ar' ? 'جديد' : 'New')}
                        {order.status === 'PROCESSING' && (currentLang === 'ar' ? 'قيد المعالجة' : 'Processing')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {currentLang === 'ar' ? 'أداء المنتجات' : 'Product Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {currentLang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
                </span>
                <span className="text-sm text-neutral-600">
                  {featuredProducts} / {totalProducts}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${(featuredProducts / totalProducts) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {currentLang === 'ar' ? 'متوسط قيمة الطلب' : 'Average Order Value'}
                </span>
                <span className="text-sm text-neutral-600">
                  {Math.round(averageOrderValue)} {currentLang === 'ar' ? 'ر.س' : 'SAR'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {currentLang === 'ar' ? 'الطلبات المعلقة' : 'Pending Orders'}
                </span>
                <span className="text-sm text-orange-600">
                  {pendingOrders}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors">
              <div className="text-center">
                <Package className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h3 className="font-medium">
                  {currentLang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {currentLang === 'ar' ? 'إضافة منتج جديد للمتجر' : 'Add a new product to the store'}
                </p>
              </div>
            </Card>

            <Card className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors">
              <div className="text-center">
                <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">
                  {currentLang === 'ar' ? 'معالجة الطلبات' : 'Process Orders'}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {currentLang === 'ar' ? 'معالجة الطلبات المعلقة' : 'Process pending orders'}
                </p>
              </div>
            </Card>

            <Card className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors">
              <div className="text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">
                  {currentLang === 'ar' ? 'الرد على الرسائل' : 'Reply to Messages'}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {currentLang === 'ar' ? 'الرد على استفسارات العملاء' : 'Reply to customer inquiries'}
                </p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
