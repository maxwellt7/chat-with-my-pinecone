import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  Brain, 
  FileText,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Offer Builder', path: '/project/offer', icon: Target },
  { id: 2, name: 'Avatar Builder', path: '/project/avatar', icon: Users },
  { id: 3, name: 'Competitor Intelligence', path: '/project/competitors', icon: TrendingUp },
  { id: 4, name: 'AI Avatar Manifold', path: '/project/manifold', icon: Brain },
  { id: 5, name: 'Launch Document', path: '/project/launch-doc', icon: FileText },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentStep = currentProject?.currentStep || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Rocket className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rapid Launch Agent</h1>
                <p className="text-sm text-gray-500">{currentProject?.name}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/project/dashboard')}
              className="btn btn-outline flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isComplete = currentStep > step.id;
                const isCurrent = location.pathname === step.path;
                const isAccessible = step.id <= currentStep;
                const Icon = step.icon;

                return (
                  <li key={step.id} className="flex items-center">
                    <button
                      onClick={() => isAccessible && navigate(step.path)}
                      disabled={!isAccessible}
                      className={clsx(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                        isCurrent && 'bg-primary-50 text-primary-700',
                        isComplete && !isCurrent && 'text-green-600 hover:bg-green-50',
                        !isComplete && !isCurrent && 'text-gray-400',
                        isAccessible && 'cursor-pointer',
                        !isAccessible && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div className={clsx(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2',
                        isCurrent && 'border-primary-600 bg-primary-600 text-white',
                        isComplete && 'border-green-600 bg-green-600 text-white',
                        !isComplete && !isCurrent && 'border-gray-300'
                      )}>
                        {isComplete ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium hidden md:block">
                        {step.name}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

