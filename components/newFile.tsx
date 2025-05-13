'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { FilePlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type NewFileProps = {
  emrId: string;
};

const NewFile: React.FC<NewFileProps> = ({ emrId }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles(filesArray);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('emrId', emrId);

    selectedFiles.forEach((file) => {
      formData.append('file', file);
    });

    try {
      setIsUploading(true);
      setUploadStatus('idle');
      const response = await fetch('/api/prescription', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const result = await response.json();
      if (result.success) {
        setUploadStatus('success');
        setSelectedFiles([]); // Clear selected files after successful upload
        setTimeout(() => setIsDialogOpen(false), 1000);
         // Close dialog after 1 second
        router.refresh(); // Refresh the page to show the new files
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const imagePreviews = selectedFiles
    .filter((file) => file.type.startsWith('image/'))
    .map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`preview-${index}`}
        className="h-20 w-20 object-cover rounded shadow-md"
      />
    ));

  return (
    <div className="bg-gray-100">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4 ">
            <FilePlus2 className="bg-amber-600 p-4 rounded-full h-16 w-16 text-white shadow-2xl transition-transform hover:scale-110 hover:bg-amber-500" />
          </button>
        </DialogTrigger>

        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded p-2"
            />
            <Button
              onClick={uploadImages}
              className="bg-amber-600 hover:bg-amber-500"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Files'}
            </Button>
            {uploadStatus === 'success' && (
              <p className="text-green-600">Files uploaded successfully!</p>
            )}
            {uploadStatus === 'error' && (
              <p className="text-red-600">Error uploading files. Please try again.</p>
            )}

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
  );
};

export default NewFile;