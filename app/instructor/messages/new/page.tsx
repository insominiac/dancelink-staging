'use client'

import { useEffect, useState } from 'react'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StudentOption { id: string; name: string; email: string }
interface ClassOption { id: string; title: string; scheduleTime: string | null }

export default function NewMessagePage() {
  useRequireInstructor()
  const { user } = useAuth()
  const router = useRouter()

  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [mode, setMode] = useState<'direct' | 'class'>('direct')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState<StudentOption[]>([])
  const [selected, setSelected] = useState<StudentOption[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [classId, setClassId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const profRes = await fetch(`/api/instructor/profile/${user.id}`)
        if (!profRes.ok) throw new Error('Instructor not found')
        const prof = await profRes.json()
        const iid = prof.instructor.id as string
        setInstructorId(iid)

        const clsRes = await fetch(`/api/instructor/classes?instructorId=${iid}&status=active&page=1&pageSize=100`)
        if (clsRes.ok) {
          const data = await clsRes.json()
          setClasses((data.items || []).map((c: any) => ({ id: c.id, title: c.title, scheduleTime: c.scheduleTime || null })))
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to init composer')
      }
    })()
  }, [user])

  useEffect(() => {
    const fetchOptions = async () => {
      if (!instructorId) return
      if (search.trim().length < 2) { setOptions([]); return }
      const params = new URLSearchParams({ instructorId, search, page: '1', pageSize: '10' })
      const res = await fetch(`/api/instructor/students?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setOptions(data.items.map((s: any) => ({ id: s.id, name: s.name, email: s.email })))
      }
    }
    fetchOptions()
  }, [search, instructorId])

  const addRecipient = (s: StudentOption) => {
    if (selected.find((x) => x.id === s.id)) return
    setSelected([...selected, s])
    setSearch('')
    setOptions([])
  }

  const removeRecipient = (id: string) => setSelected(selected.filter((x) => x.id !== id))

  const send = async () => {
    if (!instructorId) return
    setBusy(true)
    setError(null)
    try {
      let res: Response
      if (mode === 'direct') {
        if (!selected.length) throw new Error('Add at least one recipient')
        res = await fetch('/api/instructor/messages', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instructorId, recipientUserIds: selected.map(s => s.id), subject, body })
        })
      } else {
        if (!classId) throw new Error('Select a class')
        res = await fetch('/api/instructor/messages/class', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instructorId, classId, subject, body })
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to send message')
      }
      router.push('/instructor/messages')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send message')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Message</h1>
          <p className="text-gray-600">Send a direct message or a class announcement</p>
        </div>
        <Link href="/instructor/messages" className="text-sm text-gray-600">Back to messages</Link>
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-5">
        {error && <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded">{error}</div>}

        <div className="flex items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode==='direct'} onChange={() => setMode('direct')} /> Direct
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode==='class'} onChange={() => setMode('class')} /> Class Announcement
          </label>
        </div>

        {mode === 'direct' ? (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Recipients</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selected.map((s) => (
                <span key={s.id} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                  {s.name} <button className="ml-1 text-purple-600" onClick={() => removeRecipient(s.id)}>×</button>
                </span>
              ))}
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type a name or email..." className="w-full border rounded px-3 py-2" />
            {options.length > 0 && (
              <div className="mt-1 border rounded divide-y bg-white">
                {options.map((o) => (
                  <button key={o.id} type="button" onClick={() => addRecipient(o)} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                    {o.name} <span className="text-xs text-gray-500">({o.email})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Class</label>
            <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.title} {c.scheduleTime ? `(${c.scheduleTime})` : ''}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-700 mb-1">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Message</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button disabled={busy} onClick={send} className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50">{busy ? 'Sending...' : 'Send'}</button>
        </div>
      </div>
    </div>
  )
}