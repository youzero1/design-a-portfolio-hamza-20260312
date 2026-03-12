'use client';

import { useState, useEffect } from 'react';

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

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type Tab = 'projects' | 'experience' | 'messages';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Project form
  const [projectForm, setProjectForm] = useState({
    id: 0, title: '', description: '', techStack: '', thumbnailUrl: '', liveDemoUrl: '', githubUrl: '', featured: false, order: 0,
  });
  const [editingProject, setEditingProject] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Experience form
  const [expForm, setExpForm] = useState({
    id: 0, company: '', position: '', description: '', highlights: '', startDate: '', endDate: '', current: false, order: 0,
  });
  const [editingExp, setEditingExp] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'projects') loadProjects();
    else if (activeTab === 'experience') loadExperiences();
    else if (activeTab === 'messages') loadMessages();
  }, [activeTab]);

  const loadProjects = async () => {
    setLoading(true);
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadExperiences = async () => {
    setLoading(true);
    const res = await fetch('/api/experience');
    const data = await res.json();
    setExperiences(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadMessages = async () => {
    setLoading(true);
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // PROJECT CRUD
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = projectForm.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = { ...projectForm, techStack: techArray };

    if (editingProject) {
      await fetch(`/api/projects/${projectForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    resetProjectForm();
    loadProjects();
  };

  const editProject = (p: Project) => {
    const tech = (() => { try { return JSON.parse(p.techStack).join(', '); } catch { return p.techStack; } })();
    setProjectForm({ id: p.id, title: p.title, description: p.description, techStack: tech, thumbnailUrl: p.thumbnailUrl, liveDemoUrl: p.liveDemoUrl, githubUrl: p.githubUrl, featured: p.featured, order: p.order });
    setEditingProject(true);
    setShowProjectForm(true);
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    loadProjects();
  };

  const resetProjectForm = () => {
    setProjectForm({ id: 0, title: '', description: '', techStack: '', thumbnailUrl: '', liveDemoUrl: '', githubUrl: '', featured: false, order: 0 });
    setEditingProject(false);
    setShowProjectForm(false);
  };

  // EXPERIENCE CRUD
  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsArray = expForm.highlights.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = { ...expForm, highlights: highlightsArray, endDate: expForm.endDate || null };

    if (editingExp) {
      await fetch(`/api/experience/${expForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    resetExpForm();
    loadExperiences();
  };

  const editExp = (exp: Experience) => {
    const highlights = (() => { try { return JSON.parse(exp.highlights).join('\n'); } catch { return exp.highlights; } })();
    setExpForm({ id: exp.id, company: exp.company, position: exp.position, description: exp.description, highlights, startDate: exp.startDate, endDate: exp.endDate || '', current: exp.current, order: exp.order });
    setEditingExp(true);
    setShowExpForm(true);
  };

  const deleteExp = async (id: number) => {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    loadExperiences();
  };

  const resetExpForm = () => {
    setExpForm({ id: 0, company: '', position: '', description: '', highlights: '', startDate: '', endDate: '', current: false, order: 0 });
    setEditingExp(false);
    setShowExpForm(false);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-white/5">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-white font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">View Site</a>
            <button onClick={onLogout} className="btn-secondary text-sm py-2">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/5">
          {(['projects', 'experience', 'messages'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-primary-400 border-primary-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab}
              {tab === 'messages' && messages.length > 0 && (
                <span className="ml-2 bg-primary-500/20 text-primary-400 text-xs px-1.5 py-0.5 rounded-full">
                  {messages.filter((m) => !m.read).length || messages.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Projects</h2>
              <button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} className="btn-primary text-sm">
                + Add Project
              </button>
            </div>

            {showProjectForm && (
              <form onSubmit={handleProjectSubmit} className="card p-6 mb-6 space-y-4">
                <h3 className="font-bold text-white">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title *</label>
                    <input className="input-field" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tech Stack (comma-separated)</label>
                    <input className="input-field" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description *</label>
                  <textarea className="input-field resize-none" rows={3} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Thumbnail URL</label>
                    <input className="input-field" value={projectForm.thumbnailUrl} onChange={(e) => setProjectForm({ ...projectForm, thumbnailUrl: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Live Demo URL</label>
                    <input className="input-field" value={projectForm.liveDemoUrl} onChange={(e) => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">GitHub URL</label>
                    <input className="input-field" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Order:</label>
                    <input type="number" className="input-field w-20" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm">{editingProject ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={resetProjectForm} className="btn-secondary text-sm">Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white truncate">{p.title}</h3>
                        {p.featured && <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-0.5 rounded-full">Featured</span>}
                      </div>
                      <p className="text-gray-500 text-sm truncate mt-1">{p.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => editProject(p)} className="text-sm text-primary-400 hover:text-primary-300 px-3 py-1.5 border border-primary-500/20 rounded-lg hover:border-primary-500/50 transition-all">
                        Edit
                      </button>
                      <button onClick={() => deleteProject(p.id)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <div className="text-center py-12 text-gray-500">No projects yet.</div>}
              </div>
            )}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Experience</h2>
              <button onClick={() => { resetExpForm(); setShowExpForm(true); }} className="btn-primary text-sm">
                + Add Experience
              </button>
            </div>

            {showExpForm && (
              <form onSubmit={handleExpSubmit} className="card p-6 mb-6 space-y-4">
                <h3 className="font-bold text-white">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Company *</label>
                    <input className="input-field" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Position *</label>
                    <input className="input-field" value={expForm.position} onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea className="input-field resize-none" rows={3} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Highlights (one per line)</label>
                  <textarea className="input-field resize-none" rows={4} value={expForm.highlights} onChange={(e) => setExpForm({ ...expForm, highlights: e.target.value })} placeholder="Achievement 1&#10;Achievement 2" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Start Date *</label>
                    <input type="date" className="input-field" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">End Date</label>
                    <input type="date" className="input-field" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} disabled={expForm.current} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer pb-3">
                      <input type="checkbox" checked={expForm.current} onChange={(e) => setExpForm({ ...expForm, current: e.target.checked, endDate: e.target.checked ? '' : expForm.endDate })} className="w-4 h-4 accent-primary-500" />
                      <span className="text-sm text-gray-300">Current Position</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm">{editingExp ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={resetExpForm} className="btn-secondary text-sm">Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="card p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{exp.position}</h3>
                        {exp.current && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <p className="text-primary-400 text-sm">{exp.company}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => editExp(exp)} className="text-sm text-primary-400 hover:text-primary-300 px-3 py-1.5 border border-primary-500/20 rounded-lg hover:border-primary-500/50 transition-all">
                        Edit
                      </button>
                      <button onClick={() => deleteExp(exp.id)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && <div className="text-center py-12 text-gray-500">No experience entries yet.</div>}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Contact Messages</h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{msg.name}</h3>
                          <span className="text-gray-500 text-sm">·</span>
                          <span className="text-primary-400 text-sm">{msg.email}</span>
                        </div>
                        <p className="text-gray-300 font-medium mt-1">{msg.subject}</p>
                      </div>
                      <span className="text-gray-600 text-xs flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-12 text-gray-500">No messages yet.</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
