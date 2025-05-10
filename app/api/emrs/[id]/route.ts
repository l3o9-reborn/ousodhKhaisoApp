import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getUserId } from '@/lib/auth';

export async function PUT(req: NextRequest,{params}:{params:{id: string}}){
    try {
      const userId = await getUserId(req);
      const {id}=  params
      const body = await req.json();
      const { name, gender, birthDate } = body;
  
      if (!userId || !name) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }
  
      const emr = await prisma.eMR.update({
        where:{id},
        data: {
          userId,
          name,
          gender,
          birthDate: birthDate ? new Date(birthDate) : undefined,
        },
      });
  
      return NextResponse.json(emr, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Error Updating EMRS' }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request, {params}:{params:{id:string}}){
    try {
      const {id}= params

      await prisma.eMR.delete({where:{id}})
      return NextResponse.json('Operation Successful', {status: 204})
    } catch (error) {
      return NextResponse.json({error: 'Error Deleting EMRS'},{status: 500})
    }
  }


export async function GET({params}: {params: {id: string}}){
  const id= params.id
  try {
      const folder = await prisma.eMR.findUnique({
        where:{id},
        include:{
          user: true,
          prescriptions: true
        }
      })
      NextResponse.json(folder, {status: 201})
  } catch (error:any) {
      return NextResponse.json({error:'Error Fetching Folder Data'},{ status: 500})
  }
}