'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SettingItem {
  key: string;
  value: string | number | boolean | object;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string | number | boolean | object>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/settings')
      const data: SettingItem[] = await res.json()
      const map: Record<string, string | number | boolean | object> = {}
      for (const s of data) map[s.key] = s.value
      setSettings(map)
    }
    void load()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const payload = [
        { key: 'store:name', value: settings['store:name'] || '' },
        { key: 'store:currency', value: settings['store:currency'] || 'LYD' },
        { key: 'store:deliveryRegion', value: settings['store:deliveryRegion'] || 'Libya' },
        { key: 'store:contactPhone', value: settings['store:contactPhone'] || '' },
        { key: 'store:contactEmail', value: settings['store:contactEmail'] || '' },
      ]
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to save')
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Store Name</label>
            <Input value={String(settings['store:name'] || '')} onChange={e=>setSettings(s=>({ ...s, ['store:name']: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Currency</label>
            <Input value={String(settings['store:currency'] || 'LYD')} onChange={e=>setSettings(s=>({ ...s, ['store:currency']: e.target.value }))} />
            <p className="text-xs text-neutral-500 mt-1">Displayed across the storefront (e.g., LYD)</p>
          </div>
          <div className="md:col-span-2 p-3 border rounded">
            <p className="text-sm font-medium mb-2">Admin Users</p>
            <p className="text-xs text-neutral-600">Create users with admin role via API: POST /api/users. UI management can be added here later.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Delivery Region</label>
            <Input value={String(settings['store:deliveryRegion'] || 'Libya')} onChange={e=>setSettings(s=>({ ...s, ['store:deliveryRegion']: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Contact Phone</label>
            <Input value={String(settings['store:contactPhone'] || '')} onChange={e=>setSettings(s=>({ ...s, ['store:contactPhone']: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Contact Email</label>
            <Input value={String(settings['store:contactEmail'] || '')} onChange={e=>setSettings(s=>({ ...s, ['store:contactEmail']: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700">{saving ? 'Saving...' : 'Save Settings'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


