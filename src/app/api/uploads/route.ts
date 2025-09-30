import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const dir = process.env.UPLOAD_DIR || 'public/uploads';
    const base = path.join(process.cwd(), dir);
    await fs.mkdir(base, { recursive: true });

    const urls: string[] = [];
    for (const entry of files) {
      if (!(entry instanceof File)) continue;
      const arrayBuffer = await entry.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}-${entry.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(base, safeName);
      await fs.writeFile(filePath, buffer);
      // Return public URL path
      const publicPath = `/${path.posix.join(dir.replace(/^public\/?/, ''), safeName)}`;
      urls.push(publicPath);
    }

    return NextResponse.json(urls, { status: 200 });
  } catch (error) {
    console.error('Upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
