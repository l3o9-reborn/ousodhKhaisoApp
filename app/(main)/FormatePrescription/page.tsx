// Example for app/FormatePrescription/page.tsx (Next.js 13+)
'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from "react"

export default function FormatePrescription() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl');
  const [forms, setForms] = useState([
    { medicine: "", morning: "", noon: "", evening: "", duration: "" }
  ])

  const addFormSection = () => {
    setForms([
      ...forms,
      { medicine: "", morning: "", noon: "", evening: "", duration: "" }
    ])
  }

  // You can add handlers for input changes here

  return (
    <div className="grid grid-cols-3 gap-4 p-6 h-screen">
      {/* 1st Column */}
      <div className="flex flex-col gap-4 h-full">
        {/* Top: PDF Viewer */}
        <div className="flex-1 bg-white rounded shadow p-2 overflow-auto">
          {/* Replace with your PDF viewer */}
          <div className="h-64 flex items-center justify-center text-gray-400">
            PDF Viewer Here
          </div>
        </div>
        {/* Bottom: Extracted Data */}
        <div className="flex-1 bg-gray-50 rounded shadow p-2 overflow-auto">
          {/* Replace with your extracted data display */}
          <div className="text-gray-600">Extracted Data Here</div>
        </div>
      </div>

      {/* 2nd Column: Growing Form */}
      <div className="col-span-2 flex flex-col gap-4 h-full">
        <div className="flex-1 overflow-auto">
          {forms.map((form, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded bg-white shadow">
              <div className="mb-2 font-semibold">Medicine #{idx + 1}</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Medicine Name"
                  value={form.medicine}
                  // onChange={...}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Duration"
                  value={form.duration}
                  // onChange={...}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Morning Dose"
                  value={form.morning}
                  // onChange={...}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Noon Dose"
                  value={form.noon}
                  // onChange={...}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Evening Dose"
                  value={form.evening}
                  // onChange={...}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          className="self-start px-4 py-2 bg-amber-600 text-white rounded shadow hover:bg-amber-700"
          onClick={addFormSection}
        >
          + Add Medicine
        </button>
      </div>
    </div>
  )
}