'use client'

import { FC } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import {Trash2, Bot} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfModalViewerProps {
  prescription: {
    id: string  
    pdfUrl: string
  }
  onClose: () => void
}

const PdfModalViewer: FC<PdfModalViewerProps> = ({ prescription, onClose }) => {
  const { id, pdfUrl } =  prescription;
  const router = useRouter()


  const deleteFile=async()=>{
      try {
          await fetch(`/api/prescription/${id}`, {
              method: 'DELETE', 
              headers: {
                  'Content-Type': 'application/json',
              },
          })
          onClose()
          router.refresh()

      } catch (error:any) {
        console.log(error.message)
        
      }
  }


  const processPrescription = async () => {
    // Encode the pdfUrl to make it safe for URLs
    const encodedPdfUrl = encodeURIComponent(pdfUrl);
    router.push(`/FormatePrescription?pdfUrl=${encodedPdfUrl}`);
  }


  return (
    <div className="fixed inset-0 bg-white  bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white w-[100vw] h-[100vh] rounded shadow relative">
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
        {/* <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker> */}
                <iframe 
                src={`${pdfUrl}#toolbar=0&view=Fit`}
                className="w-full h-full object-cover bg-transparent"
                    style={{
                    backgroundColor: 'none', // Ensures no background
                    width: '100%',
                    height: '100%',
                  }}
                  loading="lazy"

              ></iframe>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="fixed bottom-4 right-4 ">
              <Bot 
              onClick={processPrescription}
              className="bg-amber-600 p-4 rounded-full h-16 w-16 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-amber-500" />
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-sm text-gray-700">Process Prescription</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default PdfModalViewer
