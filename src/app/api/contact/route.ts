import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/datasource';
import { ContactMessage } from '@/lib/entities/ContactMessage';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(ContactMessage);
    const messages = await repo.find({ order: { createdAt: 'DESC' } });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(ContactMessage);

    const message = repo.create({
      name: body.name,
      email: body.email,
      subject: body.subject || 'No Subject',
      message: body.message,
      read: false,
    });

    const saved = await repo.save(message);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
