import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Users, ArrowRight, Loader2, Upload } from 'lucide-react';
import { analyzeAvatar } from '../services/api';
import type { AvatarData, Demographics, WEBAnalysis, EmpathyMap, GoalsGrid } from '../types';

export default function AvatarBuilder() {
  const navigate = useNavigate();
  const { currentProject, updateAvatar, setCurrentStep } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'demographics' | 'web' | 'empathy' | 'goals'>('demographics');
  
  const [demographics, setDemographics] = useState<Demographics>(
    currentProject?.avatar?.demographics || {
      age: '',
      gender: '',
      location: '',
      income: '',
      education: '',
      occupation: '',
    }
  );

  const [webAnalysis, setWebAnalysis] = useState<WEBAnalysis>(
    currentProject?.avatar?.webAnalysis || {
      wants: [''],
      emotions: [''],
      beliefs: [''],
      dominantEmotion: '',
    }
  );

  const [empathyMap, setEmpathyMap] = useState<EmpathyMap>(
    currentProject?.avatar?.empathyMap || {
      seeing: [''],
      hearing: [''],
      saying: [''],
      thinking: [''],
      feeling: [''],
      doing: [''],
    }
  );

  const [goalsGrid, setGoalsGrid] = useState<GoalsGrid>(
    currentProject?.avatar?.goalsGrid || {
      painsAndFrustrations: [''],
      fearsAndImplications: [''],
      goalsAndDesires: [''],
      dreamsAndAspirations: [''],
    }
  );

  const [primaryCurrency, setPrimaryCurrency] = useState(currentProject?.avatar?.primaryCurrency || '');
  const [millionDollarMessage, setMillionDollarMessage] = useState(currentProject?.avatar?.millionDollarMessage || '');

  const handleArrayChange = (
    setState: Function,
    field: string,
    index: number,
    value: string
  ) => {
    setState((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
    }));
  };

  const handleAddItem = (setState: Function, field: string) => {
    setState((prev: any) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const avatarData: AvatarData = {
        demographics,
        webAnalysis,
        empathyMap,
        goalsGrid,
        primaryCurrency,
        millionDollarMessage,
      };
      
      const analysis = await analyzeAvatar(avatarData);
      updateAvatar({ ...avatarData, ...analysis });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const avatarData: AvatarData = {
      demographics,
      webAnalysis,
      empathyMap,
      goalsGrid,
      primaryCurrency,
      millionDollarMessage,
    };
    updateAvatar(avatarData);
    setCurrentStep(3);
    navigate('/project/competitors');
  };

  const tabs = [
    { id: 'demographics', label: 'Demographics' },
    { id: 'web', label: 'WEB Analysis' },
    { id: 'empathy', label: 'Empathy Map' },
    { id: 'goals', label: 'Goals Grid' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Avatar Builder</h1>
        </div>
        <p className="text-gray-600">
          Deep avatar research using Todd Brown's WEB Analysis (Wants, Emotions, Beliefs)
        </p>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-4">
              <div>
                <label className="label">Age Range</label>
                <input
                  type="text"
                  value={demographics.age}
                  onChange={(e) => setDemographics({ ...demographics, age: e.target.value })}
                  placeholder="e.g., 35-50"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Gender</label>
                <input
                  type="text"
                  value={demographics.gender}
                  onChange={(e) => setDemographics({ ...demographics, gender: e.target.value })}
                  placeholder="e.g., Male, Female, All"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={demographics.location}
                  onChange={(e) => setDemographics({ ...demographics, location: e.target.value })}
                  placeholder="e.g., Urban USA, Global"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Income Range</label>
                <input
                  type="text"
                  value={demographics.income}
                  onChange={(e) => setDemographics({ ...demographics, income: e.target.value })}
                  placeholder="e.g., $75K-$150K/year"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Education Level</label>
                <input
                  type="text"
                  value={demographics.education}
                  onChange={(e) => setDemographics({ ...demographics, education: e.target.value })}
                  placeholder="e.g., College degree"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Occupation</label>
                <input
                  type="text"
                  value={demographics.occupation}
                  onChange={(e) => setDemographics({ ...demographics, occupation: e.target.value })}
                  placeholder="e.g., Business owners, Marketers"
                  className="input"
                />
              </div>
            </div>
          )}

          {/* WEB Analysis Tab */}
          {activeTab === 'web' && (
            <div className="space-y-6">
              <div>
                <label className="label">Wants & Desires</label>
                {webAnalysis.wants.map((want, index) => (
                  <input
                    key={index}
                    type="text"
                    value={want}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'wants', index, e.target.value)}
                    placeholder="What does your prospect deeply want?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'wants')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Want
                </button>
              </div>

              <div>
                <label className="label">Emotions & Feelings</label>
                {webAnalysis.emotions.map((emotion, index) => (
                  <input
                    key={index}
                    type="text"
                    value={emotion}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'emotions', index, e.target.value)}
                    placeholder="How do they feel about their situation?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'emotions')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Emotion
                </button>
              </div>

              <div>
                <label className="label">Beliefs</label>
                {webAnalysis.beliefs.map((belief, index) => (
                  <input
                    key={index}
                    type="text"
                    value={belief}
                    onChange={(e) => handleArrayChange(setWebAnalysis, 'beliefs', index, e.target.value)}
                    placeholder="What do they believe about the problem/solution?"
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setWebAnalysis, 'beliefs')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another Belief
                </button>
              </div>

              <div>
                <label className="label">Dominant Emotion</label>
                <input
                  type="text"
                  value={webAnalysis.dominantEmotion}
                  onChange={(e) => setWebAnalysis({ ...webAnalysis, dominantEmotion: e.target.value })}
                  placeholder="e.g., Frustration, Fear, Hope"
                  className="input"
                />
              </div>
            </div>
          )}

          {/* Empathy Map Tab */}
          {activeTab === 'empathy' && (
            <div className="space-y-6">
              {Object.keys(empathyMap).map((key) => (
                <div key={key}>
                  <label className="label capitalize">What are they {key}?</label>
                  {empathyMap[key as keyof EmpathyMap].map((item: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(setEmpathyMap, key, index, e.target.value)}
                      placeholder={`What are they ${key}?`}
                      className="input mb-2"
                    />
                  ))}
                  <button
                    onClick={() => handleAddItem(setEmpathyMap, key)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Another
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Goals Grid Tab */}
          {activeTab === 'goals' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Pains & Frustrations (Now/Away From)</label>
                {goalsGrid.painsAndFrustrations.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'painsAndFrustrations', index, e.target.value)}
                    placeholder="Current pain points..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'painsAndFrustrations')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Fears & Implications (Eventual/Away From)</label>
                {goalsGrid.fearsAndImplications.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'fearsAndImplications', index, e.target.value)}
                    placeholder="Future fears..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'fearsAndImplications')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Goals & Desires (Now/Toward)</label>
                {goalsGrid.goalsAndDesires.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'goalsAndDesires', index, e.target.value)}
                    placeholder="Immediate goals..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'goalsAndDesires')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>

              <div>
                <label className="label">Dreams & Aspirations (Eventual/Toward)</label>
                {goalsGrid.dreamsAndAspirations.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(setGoalsGrid, 'dreamsAndAspirations', index, e.target.value)}
                    placeholder="Big picture dreams..."
                    className="input mb-2"
                  />
                ))}
                <button
                  onClick={() => handleAddItem(setGoalsGrid, 'dreamsAndAspirations')}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Currency & Million Dollar Message */}
      <div className="space-y-6">
        <div className="card">
          <label className="label">Primary Currency</label>
          <input
            type="text"
            value={primaryCurrency}
            onChange={(e) => setPrimaryCurrency(e.target.value)}
            placeholder="e.g., Time, Money, Status, Health"
            className="input"
          />
          <p className="text-sm text-gray-500 mt-2">What does your avatar value most?</p>
        </div>

        <div className="card">
          <label className="label">Million Dollar Message</label>
          <textarea
            value={millionDollarMessage}
            onChange={(e) => setMillionDollarMessage(e.target.value)}
            placeholder="I help [AVATAR] achieve [GOAL], so they can [DREAM] without [PAIN]"
            className="textarea"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-outline flex-1 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                <span>Analyze Avatar</span>
              </>
            )}
          </button>
          <button
            onClick={handleContinue}
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

