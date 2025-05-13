'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Worker, Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfModalViewer = dynamic(() => import('./pdfModalViewer'), {
  ssr: false,
});

export default function PdfGrid({ prescriptions }: { prescriptions: { id: string; pdfUrl: string }[] }) {
  const [selectedPdf, setSelectedPdf] = useState<{ id: string; pdfUrl: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,1fr))] gap-4">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="border rounded shadow cursor-pointer overflow-hidden bg-white"
            onClick={() => setSelectedPdf(prescription)}
          >
            <div className="aspect-[3/4] max-h-[400px] bg-gray-50 flex items-center justify-center">
              <iframe
                src={`${prescription.pdfUrl}#toolbar=0&view=Fit`}
                className="w-full h-full object-cover bg-white"
              ></iframe>
            </div>
            <div className="p-2 text-sm truncate">{prescription.id}</div>
          </div>
        ))}
      </div>

      {selectedPdf && (
        <PdfModalViewer prescription={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}
    </>
  );
}
