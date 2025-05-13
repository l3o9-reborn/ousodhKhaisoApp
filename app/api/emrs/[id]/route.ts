import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import UserId from "@/lib/userId";

export async function PUT(req: NextRequest,{params}:{params:{id: string}}){
    try {
      const userId = await UserId();
      const {id}= await  params
      const body = await req.json();
      const { name} = body;
  
      if (!userId || !name) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }
  
      const emr = await prisma.eMR.update({
        where:{id},
        data: {
          userId,
          name,
        },
      });
  
      return NextResponse.json(emr, { status: 201 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Error Updating EMRS' }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request, {params}:{params:{id:string}}){
    try {
      const {id}=await params

      await prisma.eMR.delete({where:{id}})
      return NextResponse.json('Operation Successful', {status: 200})
    } catch (error) {
      console.log(error)
      return NextResponse.json({error: 'Error Deleting EMRS'},{status: 500})
    }
  }


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const folder = await prisma.eMR.findUnique({
      where: { id },
      include: {
        prescriptions: {
          select: {
            id: true,
            pdfUrl: true,
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Map the prescriptions to include both id and pdfUrl
    const prescriptions = folder.prescriptions.map((p) => ({
      id: p.id,
      pdfUrl: p.pdfUrl,
    }));

    console.log(prescriptions);
    return NextResponse.json({ prescriptions }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching folder:', error);
    return NextResponse.json({ error: 'Error fetching folder data' }, { status: 500 });
  }
}