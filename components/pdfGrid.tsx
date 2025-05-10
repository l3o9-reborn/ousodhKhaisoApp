'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const PdfModalViewer = dynamic(() => import('./pdfModalViewer'), {
  ssr: false,
})

const pdfFiles: string[] = [
  '/files/1.pdf',
  '/files/2.pdf',
  '/files/3.pdf',
  // Add more if needed
]

export default function PdfGrid() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {pdfFiles.map((url, i) => (
          <div
            key={i}
            className="border rounded shadow cursor-pointer"
            onClick={() => setSelectedPdf(url)}
          >
            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-500">
                {i + 1}
            </div>
            <div className="p-2 text-sm truncate">{url.split('/').pop()}</div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <PdfModalViewer fileUrl={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </>
  )
}
