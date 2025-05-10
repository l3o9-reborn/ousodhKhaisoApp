'use client';

import { useState, useEffect } from 'react';

export default function PrescriptionUpload() {
  const [emrs, setEmrs] = useState([]);
  const [selectedEmr, setSelectedEmr] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/emr/list') // You'll create this route
      .then((res) => res.json())
      .then((data) => setEmrs(data));
  }, []);

  const handleUpload = async () => {
    if (!selectedEmr || !file) return alert('Select EMR and upload file');

    const formData = new FormData();
    formData.append('emrId', selectedEmr);
    formData.append('file', file);

    const res = await fetch('/api/prescription', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-2">Upload Prescription</h2>

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) => setSelectedEmr(e.target.value)}
        value={selectedEmr}
      >
        <option value="">Select EMR</option>
        {emrs.map((emr) => (
          <option key={emr.id} value={emr.id}>{emr.name}</option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        className="mb-2"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
