import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { Experience } from '@/lib/entities/Experience';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Experience);

    const exp = await repo.findOneBy({ id: parseInt(params.id) });
    if (!exp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    Object.assign(exp, {
      company: body.company ?? exp.company,
      position: body.position ?? exp.position,
      description: body.description ?? exp.description,
      highlights: body.highlights !== undefined
        ? (Array.isArray(body.highlights) ? JSON.stringify(body.highlights) : body.highlights)
        : exp.highlights,
      startDate: body.startDate ?? exp.startDate,
      endDate: body.endDate !== undefined ? body.endDate : exp.endDate,
      current: body.current ?? exp.current,
      order: body.order ?? exp.order,
    });

    const saved = await repo.save(exp);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Experience);

    const exp = await repo.findOneBy({ id: parseInt(params.id) });
    if (!exp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    await repo.remove(exp);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
