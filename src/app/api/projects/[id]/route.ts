import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { Project } from '@/lib/entities/Project';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);

    const project = await repo.findOneBy({ id: parseInt(params.id) });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    Object.assign(project, {
      title: body.title ?? project.title,
      description: body.description ?? project.description,
      techStack: body.techStack !== undefined
        ? (Array.isArray(body.techStack) ? JSON.stringify(body.techStack) : body.techStack)
        : project.techStack,
      thumbnailUrl: body.thumbnailUrl ?? project.thumbnailUrl,
      liveDemoUrl: body.liveDemoUrl ?? project.liveDemoUrl,
      githubUrl: body.githubUrl ?? project.githubUrl,
      featured: body.featured ?? project.featured,
      order: body.order ?? project.order,
    });

    const saved = await repo.save(project);
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);

    const project = await repo.findOneBy({ id: parseInt(params.id) });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await repo.remove(project);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
