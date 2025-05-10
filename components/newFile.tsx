'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { FilePlus2 } from 'lucide-react'

const NewFile: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const filesArray = Array.from(e.target.files)
    setSelectedFiles(filesArray)
  }

  const imagePreviews = selectedFiles
    .filter(file => file.type.startsWith('image/'))
    .map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`preview-${index}`}
        className="h-20 w-20 object-cover rounded shadow-md"
      />
    ))

  return (
    <div className="bg-gray-100">
      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4 z-50">
            <FilePlus2 className="bg-amber-600 p-4 rounded-full h-16 w-16 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-amber-500" />
          </button>
        </DialogTrigger>

        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>

          <DialogDescription className="space-y-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded p-2"
            />
            <Button className='bg-amber-600 hover:bg-amber-500'>Add Files</Button>
          </DialogDescription>

          <DialogFooter className="flex gap-2 flex-wrap">
            {imagePreviews.length > 0 ? (
              imagePreviews
            ) : (
              <span className="text-sm text-gray-400">No image selected</span>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewFile
