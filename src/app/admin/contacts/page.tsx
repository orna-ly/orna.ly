'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { contactsAtom, currentLangAtom, loadContactsAtom } from '@/lib/atoms'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Mail, 
  Search, 
  Eye, 
  Reply, 
  Archive,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function AdminContactsPage() {
  const [contacts] = useAtom(contactsAtom)
  const [currentLang] = useAtom(currentLangAtom)
  const [, loadContacts] = useAtom(loadContactsAtom)

  // Load contacts from backend
  useEffect(() => {
    if (contacts.length === 0) {
      void loadContacts()
    }
  }, [contacts.length, loadContacts])

  const newContacts = contacts.filter(c => c.status === 'NEW').length
  const readContacts = contacts.filter(c => c.status === 'READ').length
  const repliedContacts = contacts.filter(c => c.status === 'REPLIED').length
  const totalContacts = contacts.length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'READ': return <Eye className="h-4 w-4 text-blue-500" />
      case 'REPLIED': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <MessageCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-red-100 text-red-800 border-red-200'
      case 'READ': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'REPLIED': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === 'ar' ? 'رسائل جديدة' : 'New Messages'}
                </p>
                <p className="text-3xl font-bold text-red-600">{newContacts}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === 'ar' ? 'مقروءة' : 'Read'}
                </p>
                <p className="text-3xl font-bold text-blue-600">{readContacts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="jewelry-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-2">
                  {currentLang === 'ar' ? 'تم الرد' : 'Replied'}
                </p>
                <p className="text-3xl font-bold text-green-600">{repliedContacts}</p>
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
                  {currentLang === 'ar' ? 'إجمالي الرسائل' : 'Total Messages'}
                </p>
                <p className="text-3xl font-bold text-amber-600">{totalContacts}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {currentLang === 'ar' ? 'البحث في الرسائل' : 'Search Messages'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder={currentLang === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني أو الموضوع...' : 'Search by name, email, or subject...'}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentLang === 'ar' ? 'جميع الرسائل' : 'All Messages'}</span>
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              {totalContacts} {currentLang === 'ar' ? 'رسالة' : 'messages'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{currentLang === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'الموضوع' : 'Subject'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>{currentLang === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className={contact.status === 'NEW' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <Badge className={`${getStatusColor(contact.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(contact.status)}
                        {contact.status === 'NEW' && (currentLang === 'ar' ? 'جديد' : 'New')}
                        {contact.status === 'READ' && (currentLang === 'ar' ? 'مقروء' : 'Read')}
                        {contact.status === 'REPLIED' && (currentLang === 'ar' ? 'تم الرد' : 'Replied')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{contact.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-blue-600 underline">{contact.email}</div>
                    </TableCell>
                    <TableCell>
                      <div>{contact.phone || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate font-medium">{contact.subject}</div>
                      <div className="text-sm text-neutral-500 max-w-xs truncate mt-1">
                        {contact.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(contact.createdAt).toLocaleDateString(
                          currentLang === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {new Date(contact.createdAt).toLocaleTimeString(
                          currentLang === 'ar' ? 'ar-SA' : 'en-US',
                          { hour: '2-digit', minute: '2-digit' }
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8" title={currentLang === 'ar' ? 'عرض' : 'View'}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white" 
                          title={currentLang === 'ar' ? 'رد' : 'Reply'}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 text-neutral-600" 
                          title={currentLang === 'ar' ? 'أرشفة' : 'Archive'}
                        >
                          <Archive className="h-4 w-4" />
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

      {/* Quick Actions */}
      <Card className="jewelry-card">
        <CardHeader>
          <CardTitle>
            {currentLang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary h-16 flex-col gap-2">
              <Reply className="h-6 w-6" />
              {currentLang === 'ar' ? 'رد على الرسائل الجديدة' : 'Reply to New Messages'}
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Archive className="h-6 w-6" />
              {currentLang === 'ar' ? 'أرشفة المقروءة' : 'Archive Read Messages'}
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Mail className="h-6 w-6" />
              {currentLang === 'ar' ? 'تصدير جهات الاتصال' : 'Export Contacts'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
