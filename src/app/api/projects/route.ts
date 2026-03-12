import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { Project } from '@/lib/entities/Project';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);
    const projects = await repo.find({ order: { order: 'ASC', createdAt: 'DESC' } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Project);

    const project = repo.create({
      title: body.title,
      description: body.description,
      techStack: Array.isArray(body.techStack) ? JSON.stringify(body.techStack) : body.techStack,
      thumbnailUrl: body.thumbnailUrl || '',
      liveDemoUrl: body.liveDemoUrl || '',
      githubUrl: body.githubUrl || '',
      featured: body.featured || false,
      order: body.order || 0,
    });

    const saved = await repo.save(project);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
