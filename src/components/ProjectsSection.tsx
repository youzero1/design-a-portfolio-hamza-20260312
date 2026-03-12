'use client';

import { useEffect, useRef, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  thumbnailUrl: string;
  liveDemoUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  const parseTechStack = (ts: string): string[] => {
    try { return JSON.parse(ts); } catch { return ts.split(',').map((s) => s.trim()); }
  };

  return (
    <section id="projects" ref={sectionRef} className="py-24 bg-dark-900">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">Featured <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle animate-on-scroll">A selection of my recent work and side projects</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card h-96 animate-pulse">
                <div className="h-48 bg-dark-600 rounded-t-xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-dark-600 rounded w-3/4" />
                  <div className="h-3 bg-dark-600 rounded" />
                  <div className="h-3 bg-dark-600 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="card overflow-hidden group animate-on-scroll"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-dark-600">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-dark-700">
                      <span className="text-4xl">💻</span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-500 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-400 transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-dark-700 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-white/20 hover:bg-dark-600 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {parseTechStack(project.techStack).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🚀</div>
            <p>No projects yet. Add some from the admin panel!</p>
          </div>
        )}
      </div>
    </section>
  );
}
