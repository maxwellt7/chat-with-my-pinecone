import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  TrendingUp, 
  Brain, 
  FileText,
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentProject = useProjectStore((state) => state.currentProject);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    setChatHistory([...chatHistory, { role: 'user', content: query }]);
    
    // TODO: Implement actual query to AI
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a placeholder response. The query interface will be connected to the launch document data to answer questions like "Generate ad copy" or "Improve my landing page".'
        }
      ]);
    }, 1000);

    setQuery('');
  };

  const quickActions = [
    { label: 'Generate ad copy', icon: Sparkles },
    { label: 'Improve landing page', icon: FileText },
    { label: 'Write email sequence', icon: MessageSquare },
    { label: 'Create VSL script', icon: Target },
  ];

  const modules = [
    {
      id: 1,
      name: 'Offer Builder',
      icon: Target,
      path: '/project/offer',
      complete: !!currentProject?.offer,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Avatar Builder',
      icon: Users,
      path: '/project/avatar',
      complete: !!currentProject?.avatar,
      color: 'bg-purple-500',
    },
    {
      id: 3,
      name: 'Competitor Intelligence',
      icon: TrendingUp,
      path: '/project/competitors',
      complete: !!currentProject?.competitors,
      color: 'bg-green-500',
    },
    {
      id: 4,
      name: 'AI Avatar Manifold',
      icon: Brain,
      path: '/project/manifold',
      complete: !!currentProject?.manifold,
      color: 'bg-orange-500',
    },
    {
      id: 5,
      name: 'Launch Document',
      icon: FileText,
      path: '/project/launch-doc',
      complete: !!currentProject?.launchDoc,
      color: 'bg-pink-500',
    },
  ];

  const completedModules = modules.filter(m => m.complete).length;
  const progressPercent = (completedModules / modules.length) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Overview of your launch project and quick access to all modules
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Project Progress</h2>
          <span className="text-2xl font-bold text-primary-600">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {completedModules} of {modules.length} modules completed
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="card hover:shadow-lg transition-shadow text-left relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${module.color} opacity-10 rounded-full -mr-8 -mt-8`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${module.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${module.color.replace('bg-', 'text-')}`} />
                </div>
                {module.complete && (
                  <span className="text-green-600 text-2xl">✓</span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{module.name}</h3>
              <p className="text-sm text-gray-600">
                {module.complete ? 'Completed' : 'Not started'}
              </p>
            </button>
          );
        })}
      </div>

      {/* AI Query Interface */}
      {currentProject?.launchDoc && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Ask About Your Launch</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Ask questions about your launch document, generate copy, get recommendations, and more.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => setQuery(action.label)}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary-600 mb-1" />
                  <p className="text-sm font-medium">{action.label}</p>
                </button>
              );
            })}
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="mb-4 max-h-96 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Query Input */}
          <form onSubmit={handleQuery} className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Generate 10 Facebook ad headlines"
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

