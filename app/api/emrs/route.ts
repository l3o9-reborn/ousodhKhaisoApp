import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    const body = await req.json();
    const { name } = body;

    if (!userId || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emr = await prisma.eMR.create({
      data: {
        userId,
        name
      },
    });

    return NextResponse.json(emr, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const emrs = await prisma.eMR.findMany({
      where: { userId },
      include: {
        prescriptions: {
          select: {
            pdfUrl: true
          }
        }
      }
    });

    const result = emrs.map(emr => ({
      id: emr.id,
      name: emr.name,
      gender: emr.gender,
      birthDate: emr.birthDate,
      photo: emr.photo,
      createdAt: emr.createdAt,
      pdfUrls: emr.prescriptions.map(p => p.pdfUrl)
    }));

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error fetching EMRs:', error);
    return NextResponse.json({ error: 'Error fetching EMRs' }, { status: 500 });
  }
}

