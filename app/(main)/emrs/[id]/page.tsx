import React from 'react';
import PdfGrid from '@/components/pdfGrid';
import NewFile from '@/components/newFile';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type PageProps = {
  params: { id: string };
};

async function fetchEmrData(emrId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api';

  const res = await fetch(`${baseUrl}/emrs/${emrId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    credentials: 'include', // Include cookies for authentication
  });

  console.log('Response:', res);

  if (!res.ok) {
    throw new Error('Failed to fetch EMR data');
  }

  const data = await res.json();
  console.log('Data:', data.prescriptions); // Updated to log prescriptions
  return data.prescriptions || []; // Return the array of prescriptions
}

const SingleEmr = async ({ params }: PageProps) => {
  const { id: emrId } =await  params;

  try {
    const prescriptions = await fetchEmrData(emrId); // Fetch prescriptions with id and pdfUrl

    return (
      <main className="min-h-screen bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Folder Name</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>File Name</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PdfGrid prescriptions={prescriptions} /> {/* Pass prescriptions to PdfGrid */}
        <div>
          <NewFile emrId={emrId} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching EMR data:', error);

    return (
      <main className="min-h-screen bg-white">
        <p className="text-red-500">Failed to load EMR data. Please try again later.</p>
      </main>
    );
  }
};

export default SingleEmr;