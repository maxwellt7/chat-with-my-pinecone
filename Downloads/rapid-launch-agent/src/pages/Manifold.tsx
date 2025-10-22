import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Brain, ArrowRight, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { runManifoldWorkflow } from '../services/api';
import ReactMarkdown from 'react-markdown';

const MANIFOLD_NODES = [
  { id: 'buildABuyer', name: 'Build A Buyer', description: 'Deep buyer psychology profile' },
  { id: 'painMatrix', name: 'Pain Matrix', description: '10 pain dimensions analysis' },
  { id: 'coreWound', name: 'Core Wound', description: 'Identifying the fundamental fear' },
  { id: 'benefitMatrix', name: 'Benefit Matrix', description: 'Reverse pain into benefits' },
  { id: 'desireDaisyChain', name: 'Desire Daisy Chain', description: '3 benefit progressions' },
  { id: 'resonanceHierarchy', name: 'Resonance Hierarchy', description: 'Experiences → Beliefs → Values → Identity' },
  { id: 'rhConstraints', name: 'RH Constraints', description: 'Perceived limitations analysis' },
  { id: 'dissolution', name: 'Dissolution Frameworks', description: 'Constraint dissolution strategies' },
  { id: 'epiphanyThreshold', name: 'Epiphany Threshold', description: 'Scale of believability (1-10)' },
  { id: 'hooks', name: 'Hooks', description: 'Maze theory hook generation' },
  { id: 'storyPrompts', name: 'Story Prompts', description: 'Garden of Eden, PIG, Dark Night stories' },
  { id: 'languagePatterns', name: 'Language Patterns', description: 'Market-specific language' },
  { id: 'concentricCircles', name: 'Concentric Circles', description: 'Circles of concern analysis' },
  { id: 'ejectionTriggers', name: 'Ejection Triggers', description: 'Avoid these messaging landmines' },
];

export default function Manifold() {
  const navigate = useNavigate();
  const { currentProject, updateManifold, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [currentNode, setCurrentNode] = useState(0);
  const [results, setResults] = useState<Record<string, string>>(
    currentProject?.manifold || {}
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const isComplete = Object.keys(results).length === MANIFOLD_NODES.length;

  const handleRunWorkflow = async () => {
    if (!currentProject?.offer || !currentProject?.avatar) {
      alert('Please complete Offer Builder and Avatar Builder first');
      return;
    }

    setLoading(true);
    setCurrentNode(0);
    
    try {
      const manifoldData = await runManifoldWorkflow({
        offer: currentProject.offer,
        avatar: currentProject.avatar,
        competitors: currentProject.competitors,
      });
      
      setResults(manifoldData);
      updateManifold(manifoldData);
    } catch (error) {
      console.error('Workflow error:', error);
      alert('Failed to run manifold workflow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    updateManifold(results as any);
    setCurrentStep(5);
    navigate('/project/launch-doc');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Avatar Manifold</h1>
        </div>
        <p className="text-gray-600">
          Run the 14-node workflow to generate deep psychological insights, hooks, stories, and copywriting frameworks.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Node List */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="font-semibold text-lg mb-4">Workflow Nodes</h3>
            <div className="space-y-2">
              {MANIFOLD_NODES.map((node, index) => {
                const isCompleted = !!results[node.id];
                const isCurrent = loading && index === currentNode;
                const isSelected = selectedNode === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => isCompleted && setSelectedNode(node.id)}
                    disabled={!isCompleted}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-2 border-primary-600'
                        : isCompleted
                        ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                        : isCurrent
                        ? 'bg-yellow-50 border border-yellow-300'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{node.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{node.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleRunWorkflow}
                disabled={loading || !currentProject?.offer || !currentProject?.avatar}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Running... ({currentNode + 1}/{MANIFOLD_NODES.length})</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>{isComplete ? 'Re-run' : 'Run'} Workflow</span>
                  </>
                )}
              </button>

              {isComplete && (
                <button
                  onClick={handleContinue}
                  className="btn btn-outline w-full flex items-center justify-center space-x-2"
                >
                  <span>Continue to Launch Doc</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2">
          <div className="card min-h-[600px]">
            {selectedNode && results[selectedNode] ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {MANIFOLD_NODES.find(n => n.id === selectedNode)?.name}
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{results[selectedNode]}</ReactMarkdown>
                </div>
              </div>
            ) : isComplete ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Workflow Complete!
                </h3>
                <p className="text-gray-600 mb-6">
                  All 14 nodes have been processed. Select a node from the left to view results.
                </p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Processing: {MANIFOLD_NODES[currentNode]?.name}
                </h3>
                <p className="text-gray-600">
                  {MANIFOLD_NODES[currentNode]?.description}
                </p>
                <div className="mt-6 w-full max-w-md">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentNode + 1) / MANIFOLD_NODES.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {currentNode + 1} of {MANIFOLD_NODES.length} nodes
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Run Manifold Workflow
                </h3>
                <p className="text-gray-600 max-w-md">
                  Click "Run Workflow" to process your offer and avatar data through 14 AI agents that will generate comprehensive psychological insights and copywriting frameworks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

