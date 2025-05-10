import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PrismaClient } from '@/lib/generated/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import formidable from 'formidable';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

async function parseForm(req: NextRequest): Promise<{ emrId: string; file: File }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      const emrId = fields.emrId?.[0];
      const file = files.file?.[0];
      if (!emrId || !file) return reject('Missing emrId or file');
      resolve({ emrId, file });
    });
  });
}

async function convertImageToPdf(imagePath: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = await fs.readFile(imagePath);

  const image = await pdfDoc.embedJpg(imageBytes).catch(() => pdfDoc.embedPng(imageBytes));
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  return await pdfDoc.save();
}

export async function POST(req: NextRequest) {
  try {
    const { emrId, file }: any = await parseForm(req);

    const fileBuffer = await fs.readFile(file.filepath);
    const imageExt = path.extname(file.originalFilename || '.jpg');
    const imageFilename = `images/${uuidv4()}${imageExt}`;
    const pdfFilename = `pdfs/${uuidv4()}.pdf`;

    // Upload image
    const { data: imgUpload, error: imgErr } = await supabase.storage
      .from('prescriptions')
      .upload(imageFilename, fileBuffer, {
        contentType: file.mimetype,
      });

    if (imgErr) throw new Error(imgErr.message);

    // Convert and upload PDF
    const pdfBytes = await convertImageToPdf(file.filepath);
    const { data: pdfUpload, error: pdfErr } = await supabase.storage
      .from('prescriptions')
      .upload(pdfFilename, pdfBytes, {
        contentType: 'application/pdf',
      });

    if (pdfErr) throw new Error(pdfErr.message);

    // Get public URLs
    const imageUrl = supabase.storage.from('prescriptions').getPublicUrl(imageFilename).data.publicUrl;
    const pdfUrl = supabase.storage.from('prescriptions').getPublicUrl(pdfFilename).data.publicUrl;

    // Save to DB
    await prisma.prescription.create({
      data: {
        emrId,
        imageUrl,
        pdfUrl,
        isActive: false,
      },
    });

    return NextResponse.json({ success: true, message: 'Prescription uploaded successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
