import EMRFolder from "@/components/emrFolder";
import NewFolder from "@/components/newFolder";
import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma';


export default async function Home() {
  let result = [];
  let errorMessage = null;

  try {
    const supabase = await createClient()
  
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      console.log(`Eror`)
      redirect('/auth/login')
    }
     else {
        const userId=data?.user.id

      const emrs = await prisma.eMR.findMany({
      where: { userId },
      include: {
        prescriptions: {
          select: {
            pdfUrl: true,
          },
        },
      },
    });

      result = emrs.map((emr) => ({
      id: emr.id,
      name: emr.name,
      gender: emr.gender,
      birthDate: emr.birthDate,
      photo: emr.photo,
      createdAt: emr.createdAt,
      pdfUrls: emr.prescriptions.map((p) => p.pdfUrl),
    }));
      
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    errorMessage = "Failed to fetch EMRs"; // Handle errors properly
  }

  return (
    <div>
      {errorMessage && <div>{errorMessage}</div>} {/* Display error if any */}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
        {result.map((emr: any) => (
          <EMRFolder
            key={emr.id}
            id={emr.id}
            name={emr.name}
            pdfUrls={emr.pdfUrls}
            createdAt={new Date(emr.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />
        ))}
      </div>
      <div>
        <NewFolder/>
      </div>
    </div>
  );
}
