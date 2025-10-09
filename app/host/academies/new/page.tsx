"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

export default function NewAcademyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [website, setWebsite] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user && user.role !== 'HOST' && user.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError('Please provide an academy name')
      return
    }

    try {
      setSubmitting(true)
      const form = new FormData()
      form.append('name', name)
      form.append('description', description)
      form.append('website', website)
      form.append('city', city)
      form.append('country', country)
      if (logo) form.append('logo', logo)
      if (documents) {
        Array.from(documents).forEach((f, idx) => form.append(`documents_${idx}`, f))
      }

      const res = await fetch('/api/host/academies', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit academy for approval')
      }
      setSuccess('Academy submitted for admin approval')
      setTimeout(() => router.push('/host/academies'), 1000)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Academy</h1>
          <p className="text-sm text-gray-600 mb-6">Upload your academy details. Submissions require admin approval.</p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academy Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={city} onChange={e => setCity(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input value={country} onChange={e => setCountry(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <input type="file" accept="image/*" onChange={e => setLogo(e.target.files?.[0] || null)} />
              <p className="text-xs text-gray-500">Recommended: square PNG/JPG</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documents (optional)</label>
              <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={e => setDocuments(e.target.files)} />
              <p className="text-xs text-gray-500">Upload accreditation or brochures (PDF or images)</p>
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
