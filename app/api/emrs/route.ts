import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import UserId from '@/lib/userId';

export async function POST(req: Request) {
  try {

    const userId =await UserId()
    const body = await req.json();
    const { patientName } = body;

    if (!userId || !patientName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emr = await prisma.eMR.create({
      data: {
        userId,
        name: patientName
      },
    });

    return NextResponse.json(emr, { status: 201 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// api/emrs.ts or another API route

export async function GET(req: Request) {
  const userId = await UserId();

  if (!userId) {
    return NextResponse.redirect("/auth/login");
  }

  try {
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

    const result = emrs.map((emr) => ({
      id: emr.id,
      name: emr.name,
      gender: emr.gender,
      birthDate: emr.birthDate,
      photo: emr.photo,
      createdAt: emr.createdAt,
      pdfUrls: emr.prescriptions.map((p) => p.pdfUrl),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching EMRs:", error);
    return NextResponse.json({ error: "Error fetching EMRs" }, { status: 500 });
  }
}


