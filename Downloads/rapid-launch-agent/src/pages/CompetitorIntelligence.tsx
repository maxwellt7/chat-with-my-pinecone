import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { TrendingUp, ArrowRight, Loader2, Plus, X } from 'lucide-react';
import { analyzeCompetitors } from '../services/api';
import type { CompetitorData, Competitor } from '../types';

export default function CompetitorIntelligence() {
  const navigate = useNavigate();
  const { currentProject, updateCompetitors, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  
  const [industry, setIndustry] = useState(currentProject?.competitors?.industry || '');
  const [competitors, setCompetitors] = useState<Partial<Competitor>[]>(
    currentProject?.competitors?.competitors || [{ name: '', url: '' }]
  );

  const handleAddCompetitor = () => {
    setCompetitors([...competitors, { name: '', url: '' }]);
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleCompetitorChange = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeCompetitors({
        industry,
        competitorUrls: competitors.filter(c => c.url).map(c => c.url!),
      });
      updateCompetitors(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze competitors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const data: CompetitorData = {
      industry,
      competitors: competitors as Competitor[],
      marketIntelligence: currentProject?.competitors?.marketIntelligence || {
        marketSize: '',
        growthTrends: [],
        opportunities: [],
        threats: [],
      },
      positioningAngles: currentProject?.competitors?.positioningAngles || [],
      mvpFeatures: currentProject?.competitors?.mvpFeatures || [],
      distributionStrategy: currentProject?.competitors?.distributionStrategy || '',
    };
    updateCompetitors(data);
    setCurrentStep(4);
    navigate('/project/manifold');
  };

  const isFormValid = industry && competitors.some(c => c.url);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Competitor Intelligence</h1>
        </div>
        <p className="text-gray-600">
          Forensic market analysis to identify opportunities, threats, and strategic positioning angles.
        </p>
      </div>

      <div className="space-y-6">
        {/* Industry */}
        <div className="card">
          <label className="label">Industry / Niche *</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g., B2B SaaS Marketing Tools"
            className="input"
          />
        </div>

        {/* Competitors */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <label className="label mb-0">Competitor URLs *</label>
            <button
              onClick={handleAddCompetitor}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Competitor</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  value={competitor.name || ''}
                  onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                  placeholder="Competitor name"
                  className="input flex-1"
                />
                <input
                  type="url"
                  value={competitor.url || ''}
                  onChange={(e) => handleCompetitorChange(index, 'url', e.target.value)}
                  placeholder="https://competitor-url.com"
                  className="input flex-1"
                />
                {competitors.length > 1 && (
                  <button
                    onClick={() => handleRemoveCompetitor(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Add 5-7 top competitors for comprehensive analysis
          </p>
        </div>

        {/* Analysis Results */}
        {currentProject?.competitors?.positioningAngles && currentProject.competitors.positioningAngles.length > 0 && (
          <div className="card bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Analysis Complete ✓</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Positioning Angles</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {currentProject.competitors.positioningAngles.map((angle, i) => (
                    <li key={i}>{angle}</li>
                  ))}
                </ul>
              </div>
              {currentProject.competitors.mvpFeatures && currentProject.competitors.mvpFeatures.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">MVP Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {currentProject.competitors.mvpFeatures.slice(0, 3).map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Context (Optional) */}
        <div className="card">
          <label className="label">Additional Market Observations (Optional)</label>
          <textarea
            placeholder="Any additional insights about the competitive landscape, market trends, or opportunities you've observed..."
            className="textarea"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={!isFormValid || loading}
            className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>Analyze Competitors</span>
              </>
            )}
          </button>
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <span>Save & Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

