import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'



export async function GET({params}:{params:{id: string}}){
    const id= params.id

    try {
        const data= await prisma.prescription.findUnique({
            where:{
                id
            }
        })
        NextResponse.json(data, {status: 201})
    } catch (error:any) {
        NextResponse.json({error: error.message|| 'Fetch Failed'}, {status: 404})
    }
}

export async function DELETE({params}:{params:{id: string}}){
    const id=params.id

    try {
        await prisma.prescription.delete({
            where:{id}
        })
        
    } catch (error:any) {
        NextResponse.json({error: error.message || 'Delete failed' },{status: 500})
    }

}