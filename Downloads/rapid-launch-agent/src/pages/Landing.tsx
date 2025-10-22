import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Rocket, Target, Users, TrendingUp, Brain, FileText, Plus, FolderOpen } from 'lucide-react';

export default function Landing() {
  const [projectName, setProjectName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const navigate = useNavigate();
  const { projects, createProject, loadProject } = useProjectStore();

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      createProject(projectName);
      navigate('/project/offer');
    }
  };

  const handleLoadProject = (id: string) => {
    loadProject(id);
    navigate('/project/offer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Rapid Launch Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your marketing strategy with AI-powered insights. Build comprehensive launch documents using Todd Brown's E5 VSL methodology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <Target className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Offer Analysis</h3>
            <p className="text-gray-600 text-sm">
              Deep analysis using the Irresistible Offer Equation with 10 strategic improvements
            </p>
          </div>
          <div className="card text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Avatar Builder</h3>
            <p className="text-gray-600 text-sm">
              WEB analysis (Wants, Emotions, Beliefs) with empathy mapping and psychology profiling
            </p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Competitor Intel</h3>
            <p className="text-gray-600 text-sm">
              Forensic market analysis with positioning angles and distribution strategies
            </p>
          </div>
          <div className="card text-center">
            <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Manifold</h3>
            <p className="text-gray-600 text-sm">
              14-node workflow generating deep psychological insights and copywriting frameworks
            </p>
          </div>
          <div className="card text-center">
            <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Launch Document</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive 38+ section marketing brief ready for team implementation
            </p>
          </div>
          <div className="card text-center bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <Rocket className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Complete System</h3>
            <p className="text-sm">
              Everything you need to launch with confidence and precision
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="max-w-2xl mx-auto">
          {!showNewProject && projects.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FolderOpen className="w-6 h-6 mr-2" />
                Your Projects
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleLoadProject(project.id)}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">
                          Step {project.currentStep} of 5 • Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-primary-600">→</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            {!showNewProject ? (
              <button
                onClick={() => setShowNewProject(true)}
                className="btn btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
              >
                <Plus className="w-6 h-6" />
                <span>Create New Project</span>
              </button>
            ) : (
              <form onSubmit={handleCreateProject}>
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <div className="mb-4">
                  <label className="label">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., SaaS Product Launch Q1 2024"
                    className="input"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Create & Start
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

