'use client'; // Add this directive to indicate it's a client-side component

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FolderPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NewFolder = () => {
  // State to manage the patient name input and submission status
  const router= useRouter()
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!patientName) {
      setError('Patient name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send data to the server (API route)
      const response = await fetch('/api/emrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientName }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Record created successfully!');
        setPatientName(''); // Clear input after submission
        router.push('/emrs')
      } else {
        setError(result.error || 'Failed to create record');
      }
    } catch (error) {
      setError('An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className='fixed bottom-4 right-4'>
          <FolderPlus className="bg-amber-600 p-4 rounded-full h-15 w-15 text-white shadow-2xl hover:scale-120 hover:transition-transform hover:bg-amber-500" />
        </DialogTrigger>
        <DialogContent className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Add New Record</DialogTitle>
          </DialogHeader>
          {/* <DialogDescription className="space-y-2"> */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Input
                  id="patientName"
                  name="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)} // Handle input change
                  placeholder="Enter Patient Name"
                  className="block w-full border-gray-300 rounded p-2"
                />
              </div>

              {/* Show success or error messages */}
              {error && <div className="text-red-500">{error}</div>}
              {success && <div className="text-green-500">{success}</div>}

              <Button type="submit" className="mt-3 bg-amber-600 hover:bg-amber-500" disabled={loading}>
                {loading ? 'Creating...' : 'Create New Record'}
              </Button>
            </form>
          {/* </DialogDescription> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewFolder;
