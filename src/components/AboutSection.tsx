'use client';

import { useEffect, useRef } from 'react';

const skills = [
  { name: 'TypeScript / JavaScript', level: 95, color: 'from-primary-400 to-primary-600' },
  { name: 'React / Next.js', level: 92, color: 'from-primary-400 to-accent-400' },
  { name: 'Node.js / Express', level: 88, color: 'from-accent-400 to-accent-600' },
  { name: 'PostgreSQL / SQLite', level: 85, color: 'from-green-400 to-green-600' },
  { name: 'Docker / Kubernetes', level: 78, color: 'from-blue-400 to-blue-600' },
  { name: 'Python / FastAPI', level: 75, color: 'from-yellow-400 to-orange-400' },
  { name: 'AWS / Cloud Services', level: 80, color: 'from-orange-400 to-red-400' },
  { name: 'GraphQL / REST APIs', level: 90, color: 'from-pink-400 to-accent-400' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-dark-800">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title animate-on-scroll">About <span className="gradient-text">Me</span></h2>
          <p className="section-subtitle animate-on-scroll">Passionate developer with a love for crafting digital experiences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div className="space-y-6 animate-on-scroll">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-5xl font-black text-white mb-8">
                AJ
              </div>
              <div className="absolute -top-2 -left-2 w-32 h-32 rounded-2xl border border-primary-500/20 -z-10" />
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">
              I&apos;m a full-stack developer with over 5 years of experience building
              web applications that scale. My journey started with a curiosity about
              how websites work, and it evolved into a deep passion for creating
              elegant, performant, and user-centric digital products.
            </p>

            <p className="text-gray-400 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me contributing to open-source projects,
              writing technical articles, or exploring the latest developments in AI
              and machine learning. I believe in continuous learning and sharing
              knowledge with the developer community.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: '📍', label: 'Location', value: 'San Francisco, CA' },
                { icon: '🎓', label: 'Education', value: 'B.S. Computer Science' },
                { icon: '💼', label: 'Status', value: 'Open to Opportunities' },
                { icon: '🌐', label: 'Languages', value: 'EN, ES, FR' },
              ].map((item) => (
                <div key={item.label} className="bg-dark-700 rounded-lg p-4 border border-white/5">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">{item.label}</div>
                  <div className="text-white text-sm font-medium mt-1">{item.value}</div>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2"
              onClick={(e) => { e.preventDefault(); alert('Resume download would be configured with actual file.'); }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </div>

          {/* Skills */}
          <div className="space-y-5 animate-on-scroll">
            <h3 className="text-xl font-bold text-white mb-6">Technical Skills</h3>
            {skills.map((skill, idx) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">{skill.name}</span>
                  <span className="text-primary-400 font-mono">{skill.level}%</span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                    style={{ width: '0%' }}
                    ref={(el) => {
                      if (el) {
                        setTimeout(() => {
                          el.style.width = `${skill.level}%`;
                        }, idx * 100 + 300);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
