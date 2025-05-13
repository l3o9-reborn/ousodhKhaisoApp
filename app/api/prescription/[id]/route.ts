import {prisma} from '@/lib/prisma'
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

export async function DELETE(req: Request, {params}:{params:{id: string}}){
    const {id}= await params
    console.log(`id from delete`,id)

    try {
        await prisma.prescription.delete({
            where:{id}
        })

        return NextResponse.json('Operation Successful', {status: 200})
        
    } catch (error:any) {
        NextResponse.json({error: error.message || 'Delete failed' },{status: 500})
    }

}