'use client'

export default function ConfirmationActions() {
  return (
    <div className="px-6 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => window.print()}
        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
      >
        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Receipt
      </button>
      <a
        href="/"
        className="flex-1 bg-purple-600 text-white text-center px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        Back to Home
      </a>
    </div>
  )
}
