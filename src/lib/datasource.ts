import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from './entities/Project';
import { Experience } from './entities/Experience';
import { ContactMessage } from './entities/ContactMessage';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/portfolio.db';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);

// Ensure data directory exists
const dataDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let AppDataSource: DataSource;

if (!(global as any).__typeormDataSource) {
  AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    entities: [Project, Experience, ContactMessage],
    synchronize: true,
    logging: false,
  });
  (global as any).__typeormDataSource = AppDataSource;
} else {
  AppDataSource = (global as any).__typeormDataSource;
}

export { AppDataSource };

export async function getDataSource(): Promise<DataSource> {
  const ds = (global as any).__typeormDataSource as DataSource;
  if (!ds.isInitialized) {
    await ds.initialize();
    await seedDatabase(ds);
  }
  return ds;
}

async function seedDatabase(ds: DataSource): Promise<void> {
  const projectRepo = ds.getRepository(Project);
  const experienceRepo = ds.getRepository(Experience);

  const projectCount = await projectRepo.count();
  if (projectCount === 0) {
    const projects: Partial<Project>[] = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform with real-time inventory management, payment processing, and an admin dashboard. Built with performance and scalability in mind.',
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis', 'Docker']),
        thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
        liveDemoUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/example/ecommerce',
        featured: true,
        order: 1,
      },
      {
        title: 'AI Chat Application',
        description: 'A real-time chat application powered by AI with natural language processing, sentiment analysis, and intelligent auto-responses.',
        techStack: JSON.stringify(['React', 'Node.js', 'Socket.io', 'OpenAI API', 'MongoDB', 'TailwindCSS']),
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop',
        liveDemoUrl: 'https://chat.example.com',
        githubUrl: 'https://github.com/example/ai-chat',
        featured: true,
        order: 2,
      },
      {
        title: 'DevOps Dashboard',
        description: 'A comprehensive DevOps monitoring dashboard with real-time metrics, CI/CD pipeline visualization, and automated alerting.',
        techStack: JSON.stringify(['Vue.js', 'Python', 'FastAPI', 'Prometheus', 'Grafana', 'Kubernetes']),
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        liveDemoUrl: 'https://devops.example.com',
        githubUrl: 'https://github.com/example/devops-dashboard',
        featured: false,
        order: 3,
      },
    ];

    for (const p of projects) {
      const project = projectRepo.create(p);
      await projectRepo.save(project);
    }
  }

  const expCount = await experienceRepo.count();
  if (expCount === 0) {
    const experiences: Partial<Experience>[] = [
      {
        company: 'TechCorp Solutions',
        position: 'Senior Full-Stack Developer',
        description: 'Led development of microservices architecture serving 2M+ users. Mentored a team of 5 developers and drove adoption of modern development practices.',
        highlights: JSON.stringify([
          'Reduced API response time by 60% through Redis caching implementation',
          'Led migration from monolith to microservices architecture',
          'Implemented CI/CD pipelines reducing deployment time by 80%',
          'Mentored junior developers through code reviews and workshops',
        ]),
        startDate: '2022-01-01',
        endDate: null,
        current: true,
        order: 1,
      },
      {
        company: 'StartupXYZ',
        position: 'Full-Stack Developer',
        description: 'Built and shipped multiple features for a SaaS product from 0 to 10k users. Worked in an agile environment with cross-functional teams.',
        highlights: JSON.stringify([
          'Developed real-time collaboration features using WebSockets',
          'Integrated payment systems processing $1M+ in transactions',
          'Built mobile-responsive UI components used across the product',
          'Optimized database queries improving load time by 40%',
        ]),
        startDate: '2020-03-01',
        endDate: '2021-12-31',
        current: false,
        order: 2,
      },
      {
        company: 'Digital Agency Co.',
        position: 'Junior Web Developer',
        description: 'Developed custom web solutions for clients across various industries. Gained hands-on experience with modern web technologies and best practices.',
        highlights: JSON.stringify([
          'Delivered 20+ client projects on time and within budget',
          'Built responsive websites achieving 95+ Lighthouse scores',
          'Collaborated with designers to implement pixel-perfect UIs',
        ]),
        startDate: '2018-06-01',
        endDate: '2020-02-28',
        current: false,
        order: 3,
      },
    ];

    for (const e of experiences) {
      const exp = experienceRepo.create(e);
      await experienceRepo.save(exp);
    }
  }
}
