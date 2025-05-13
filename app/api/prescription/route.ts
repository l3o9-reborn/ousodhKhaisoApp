import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { PDFDocument } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse multipart form data
async function parseMultipartFormData(req: NextRequest): Promise<{ emrId: string; files: File[] }> {
  const formData = await req.formData();
  const emrId = formData.get('emrId') as string;

  if (!emrId) {
    throw new Error('Missing emrId');
  }

  const files: File[] = [];
  formData.forEach((value, key) => {
    if (key === 'file' && value instanceof File) {
      files.push(value);
    }
  });

  if (files.length === 0) {
    throw new Error('No files uploaded');
  }

  return { emrId, files };
}

// Helper to save files to a temporary directory
async function saveFilesToTemp(files: File[]): Promise<string[]> {
  const tempDir = path.join(process.cwd(), 'uploads');
  await fs.mkdir(tempDir, { recursive: true });

  const filePaths: string[] = [];
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(tempDir, `${uuidv4()}-${file.name}`);
    await fs.writeFile(filePath, buffer);
    filePaths.push(filePath);
  }

  return filePaths;
}

// Helper to convert a single image file into a PDF
async function convertImageToPdf(imagePath: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = await fs.readFile(imagePath);

  let image;
  try {
    image = await pdfDoc.embedJpg(imageBytes);
  } catch {
    image = await pdfDoc.embedPng(imageBytes);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  return await pdfDoc.save();
}

// API POST handler
export async function POST(req: NextRequest) {
  try {
    console.log('Parsing form data...');
    const { emrId, files } = await parseMultipartFormData(req);
    console.log('Form data parsed successfully:', { emrId, files });

    console.log('Saving files to temporary directory...');
    const imagePaths = await saveFilesToTemp(files);
    console.log('Files saved:', imagePaths);

    const pdfUrls: string[] = [];

    for (const imagePath of imagePaths) {
      console.log(`Converting image ${imagePath} to PDF...`);
      const pdfBytes = await convertImageToPdf(imagePath);
      console.log('PDF conversion successful');

      const pdfFilename = `pdfs/${uuidv4()}.pdf`;
      console.log(`Uploading PDF ${pdfFilename} to Supabase...`);
      const { error: pdfErr } = await supabase.storage
        .from('prescriptions')
        .upload(pdfFilename, Buffer.from(pdfBytes), {
          contentType: 'application/pdf',
        });

      if (pdfErr) throw new Error(pdfErr.message);
      console.log('PDF uploaded successfully');

      const pdfUrl = supabase.storage.from('prescriptions').getPublicUrl(pdfFilename).data.publicUrl;
      console.log('PDF URL:', pdfUrl);

      pdfUrls.push(pdfUrl);

      console.log('Saving PDF URL to database...');
      await prisma.prescription.create({
        data: {
          emrId,
          pdfUrl,
          imageUrl: 'not-available', // No image URL since it's converted to PDF
          isActive: false,
        },
      });
      console.log('PDF URL saved to database successfully');
    }

    console.log('All PDFs uploaded and saved to database successfully');

    return NextResponse.json({
      success: true,
      message: 'Images converted to PDFs and uploaded successfully.',
      pdfUrls,
    });
  } catch (err: any) {
    console.error('Error in POST handler:', err);
    return NextResponse.json({ success: false, error: err.message || 'Upload failed' }, { status: 500 });
  }
}
