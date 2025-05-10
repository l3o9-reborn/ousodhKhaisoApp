'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EMRForm() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/emrs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        gender,
        birthDate,
        photo,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert('EMR created successfully!');
      router.refresh(); // refresh the current page to show changes
    } else {
      alert('Failed to create EMR: ' + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <h2 className="text-xl font-bold">Create Electronic Medical Record</h2>

      <div>
        <label className="block mb-1">Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1">Gender</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Birth Date</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1">Photo URL (optional)</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create EMR'}
      </button>
    </form>
  );
}
