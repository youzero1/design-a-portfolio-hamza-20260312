'use client';

import { useEffect, useRef, useState } from 'react';

interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  highlights: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((data) => {
        setExperiences(Array.isArray(data) ? data : []);
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
  }, [experiences]);

  const parseHighlights = (h: string): string[] => {
    try { return JSON.parse(h); } catch { return []; }
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" ref={sectionRef} className="py-24 bg-dark-800">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">Work <span className="gradient-text">Experience</span></h2>
          <p className="section-subtitle animate-on-scroll">My professional journey and career highlights</p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-dark-600 rounded w-1/3 mb-3" />
                <div className="h-4 bg-dark-600 rounded w-1/4 mb-4" />
                <div className="h-3 bg-dark-600 rounded mb-2" />
                <div className="h-3 bg-dark-600 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-500 to-transparent hidden lg:block" />

            <div className="space-y-8">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="relative flex gap-8 animate-on-scroll"
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full border-2 z-10 mt-6 flex-shrink-0 ${
                      exp.current
                        ? 'bg-primary-500 border-primary-400 shadow-lg shadow-primary-500/50'
                        : 'bg-dark-700 border-gray-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="card p-6 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary-400 font-medium">{exp.company}</span>
                          {exp.current && (
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 font-mono flex-shrink-0">
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                    {parseHighlights(exp.highlights).length > 0 && (
                      <ul className="space-y-2">
                        {parseHighlights(exp.highlights).map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-primary-500 mt-1 flex-shrink-0">▹</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
