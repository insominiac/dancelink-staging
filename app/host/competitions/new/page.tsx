"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface VenueOption { id: string; name: string }

export default function NewCompetitionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [venueId, setVenueId] = useState("")
  const [description, setDescription] = useState("")
  const [expectedParticipants, setExpectedParticipants] = useState<number | ''>("")
  const [attachments, setAttachments] = useState<FileList | null>(null)
  const [venues, setVenues] = useState<VenueOption[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user && user.role !== 'HOST' && user.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const res = await fetch('/api/host/venues')
        const data = await res.json()
        if (res.ok) {
          const vs: VenueOption[] = (data.venues || []).map((v: any) => ({ id: v.id, name: v.name }))
          setVenues(vs)
        }
      } catch {
        // non-blocking
      }
    }
    loadVenues()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim() || !startDate || !endDate) {
      setError('Please complete the required fields')
      return
    }

    try {
      setSubmitting(true)
      const form = new FormData()
      form.append('name', name)
      form.append('startDate', startDate)
      form.append('endDate', endDate)
      if (venueId) form.append('venueId', venueId)
      form.append('description', description)
      if (expectedParticipants !== '') form.append('expectedParticipants', String(expectedParticipants))
      if (attachments) Array.from(attachments).forEach((f, idx) => form.append(`attachment_${idx}`, f))

      const res = await fetch('/api/host/competitions', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit competition request')
      }
      setSuccess('Competition request submitted for admin approval')
      setTimeout(() => router.push('/host/competitions'), 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Request a Competition</h1>
          <p className="text-sm text-gray-600 mb-6">Provide details about the competition. Your request will be reviewed by admin.</p>

          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
          {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Competition Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue (optional)</label>
              <select value={venueId} onChange={e => setVenueId(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                <option value="">Select a venue</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Participants (optional)</label>
              <input type="number" min={0} value={expectedParticipants} onChange={e => setExpectedParticipants(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
              <input type="file" multiple onChange={e => setAttachments(e.target.files)} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
              <p className="text-xs text-gray-500">Upload flyers, rules, or schedule (PDF or images)</p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button disabled={submitting} type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60">
                {submitting ? 'Submitting…' : 'Submit for Approval'}
              </button>
              <button type="button" className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
