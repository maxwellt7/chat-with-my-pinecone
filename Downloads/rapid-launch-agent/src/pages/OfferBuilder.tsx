import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Target, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeOffer } from '../services/api';
import type { OfferData } from '../types';

export default function OfferBuilder() {
  const navigate = useNavigate();
  const { currentProject, updateOffer, updateAvatar, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OfferData>(
    currentProject?.offer || {
      targetMarket: '',
      pressingProblem: '',
      desiredOutcome: '',
      productDescription: '',
      productPromise: '',
      proofElements: '',
      pricing: '',
      guarantee: '',
      analysis: null,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeOffer(formData);
      const updatedData = { ...formData, analysis };
      updateOffer(updatedData);
      setFormData(updatedData);
      
      // Show success message if avatar suggestions are included
      if (analysis.suggestedAvatar) {
        alert('✅ Offer analyzed! Avatar Builder has been pre-populated with suggested avatar insights. Click "Save & Continue" to review.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    updateOffer(formData);
    
    // If we have suggested avatar data from the analysis, pre-populate avatar
    if (formData.analysis?.suggestedAvatar) {
      const suggested = formData.analysis.suggestedAvatar;
      updateAvatar({
        demographics: suggested.demographics,
        webAnalysis: {
          wants: suggested.primaryWants,
          emotions: suggested.primaryEmotions,
          beliefs: suggested.primaryBeliefs,
          dominantEmotion: suggested.dominantEmotion,
        },
        empathyMap: {
          seeing: [''],
          hearing: [''],
          saying: [''],
          thinking: [''],
          feeling: [''],
          doing: [''],
        },
        goalsGrid: {
          painsAndFrustrations: [''],
          fearsAndImplications: [''],
          goalsAndDesires: [''],
          dreamsAndAspirations: [''],
        },
        primaryCurrency: suggested.primaryCurrency,
        millionDollarMessage: suggested.millionDollarMessage,
      });
    }
    
    setCurrentStep(2);
    navigate('/project/avatar');
  };

  const isFormValid = formData.targetMarket && formData.pressingProblem && formData.productDescription;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Target className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Offer Builder</h1>
        </div>
        <p className="text-gray-600">
          Analyze your offer using the Irresistible Offer Equation. We'll evaluate essential components and provide 10 strategic improvements.
        </p>
      </div>

      <div className="space-y-6">
        {/* Target Market */}
        <div className="card">
          <label className="label">Target Market *</label>
          <input
            type="text"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            placeholder="e.g., B2B SaaS founders with $100K-$1M ARR"
            className="input"
          />
        </div>

        {/* Pressing Problem */}
        <div className="card">
          <label className="label">Pressing Problem *</label>
          <textarea
            name="pressingProblem"
            value={formData.pressingProblem}
            onChange={handleChange}
            placeholder="What urgent problem does your target market face?"
            className="textarea"
          />
        </div>

        {/* Desired Outcome */}
        <div className="card">
          <label className="label">Desired Outcome</label>
          <textarea
            name="desiredOutcome"
            value={formData.desiredOutcome}
            onChange={handleChange}
            placeholder="What transformation do they seek?"
            className="textarea"
          />
        </div>

        {/* Product Description */}
        <div className="card">
          <label className="label">Product/Service Description *</label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleChange}
            placeholder="Describe your product or service in detail"
            className="textarea"
          />
        </div>

        {/* Product Promise */}
        <div className="card">
          <label className="label">Core Promise</label>
          <input
            type="text"
            name="productPromise"
            value={formData.productPromise}
            onChange={handleChange}
            placeholder="e.g., 10X your leads in 90 days or your money back"
            className="input"
          />
        </div>

        {/* Proof Elements */}
        <div className="card">
          <label className="label">Proof Elements</label>
          <textarea
            name="proofElements"
            value={formData.proofElements}
            onChange={handleChange}
            placeholder="Testimonials, case studies, reviews, credentials, statistics..."
            className="textarea"
          />
        </div>

        {/* Pricing */}
        <div className="card">
          <label className="label">Pricing & Payment Options</label>
          <input
            type="text"
            name="pricing"
            value={formData.pricing}
            onChange={handleChange}
            placeholder="e.g., $997 one-time or 3 payments of $349"
            className="input"
          />
        </div>

        {/* Guarantee */}
        <div className="card">
          <label className="label">Guarantee / Risk Reversal</label>
          <textarea
            name="guarantee"
            value={formData.guarantee}
            onChange={handleChange}
            placeholder="What guarantee do you offer to reduce buyer risk?"
            className="textarea"
          />
        </div>

        {/* Analysis Results */}
        {formData.analysis && (
          <div className="card bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Analysis Complete ✓</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Essential Components</h4>
                <div className="space-y-1 text-sm">
                  <p>Massive Pain: {formData.analysis.essentialComponents.massivePain}/10</p>
                  <p>Purchasing Power: {formData.analysis.essentialComponents.purchasingPower}/10</p>
                  <p>Easy to Target: {formData.analysis.essentialComponents.easyToTarget}/10</p>
                  <p>Growing Market: {formData.analysis.essentialComponents.growingMarket}/10</p>
                  <p className="font-semibold">Average: {formData.analysis.essentialComponents.average.toFixed(2)}/10</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Irresistible Equation</h4>
                <div className="space-y-1 text-sm">
                  <p>Promise Size: {formData.analysis.irresistibleEquation.promiseSize}/10</p>
                  <p>Perceived Likelihood: {formData.analysis.irresistibleEquation.perceivedLikelihood}/10</p>
                  <p>Time Delay: {formData.analysis.irresistibleEquation.timeDelay}/10 (inverse)</p>
                  <p>Effort Required: {formData.analysis.irresistibleEquation.effortRequired}/10 (inverse)</p>
                  <p className="font-semibold">Score: {formData.analysis.irresistibleEquation.score.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Generated {formData.analysis.recommendations.length} strategic recommendations
            </p>
          </div>
        )}

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
                <Target className="w-5 h-5" />
                <span>Analyze Offer</span>
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

