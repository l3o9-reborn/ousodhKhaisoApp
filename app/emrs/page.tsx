import EMRFolder from "@/components/emrFolder";
import NewFolder from "@/components/newFolder";
import { headers } from "next/headers"; // use headers instead of cookies()

export default async function Home() {
  let data: any[] = [];

  try {
    const headersList = headers(); // next/headers is static-compatible
    const cookieHeader = headersList.get("cookie") ?? "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emrs`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader, // forward full cookie header
      },
      cache: "no-store", // prevent caching stale data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch EMRs");
    }

    data = await res.json();
  } catch (error) {
    console.error("Error fetching EMRs:", error);
    return <div className="text-red-500">Failed to load EMRs</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4">
        {data.map((emr: any) => (
          <EMRFolder
            key={emr.id}
            id={emr.id}
            name={emr.name}
            createdAt={new Date(emr.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          />
        ))}
      </div>
      <div>
        <NewFolder />
      </div>
    </div>
  );
}
