import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { Experience } from '@/lib/entities/Experience';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Experience);
    const experiences = await repo.find({ order: { order: 'ASC' } });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Experience);

    const exp = repo.create({
      company: body.company,
      position: body.position,
      description: body.description,
      highlights: Array.isArray(body.highlights) ? JSON.stringify(body.highlights) : (body.highlights || '[]'),
      startDate: body.startDate,
      endDate: body.endDate || null,
      current: body.current || false,
      order: body.order || 0,
    });

    const saved = await repo.save(exp);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
