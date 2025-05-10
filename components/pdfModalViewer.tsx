'use client'

import { FC } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import {Trash2} from 'lucide-react'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfModalViewerProps {
  fileUrl: string
  onClose: () => void
}

const PdfModalViewer: FC<PdfModalViewerProps> = ({ fileUrl, onClose }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()


  const deleteFile=()=>{
    
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] h-[90vh] rounded shadow relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-amber-600 bg-opacity-70 px-2 py-1 rounded"
        >
          ✕
        </button>
        <button
            onClick={deleteFile}
            className="absolute top-2 right-10 text-white bg-amber-600 bg-opacity-70 px-2 py-1 rounded"
        >
            <Trash2/>
        </button>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </div>
  )
}

export default PdfModalViewer
