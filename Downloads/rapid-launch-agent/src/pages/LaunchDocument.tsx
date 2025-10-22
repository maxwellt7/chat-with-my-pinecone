import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { FileText, Download, Loader2, Search } from 'lucide-react';
import { generateLaunchDocument } from '../services/api';
import ReactMarkdown from 'react-markdown';

const LAUNCH_DOC_SECTIONS = [
  'Prospect analysis', 'Prospect WEB Analysis', 'Competitor analysis', '10-point product analysis',
  '3 types of benefits', 'Promise exposure spectrum', 'Prospect awareness pyramid',
  '3D prospect psyche profile', 'Perfect customer-generating product', 'Engineering the perfect offer',
  'Type of offer', 'Deliverable, feature, why', 'Price & terms', 'Risk reversal',
  'Premiums/Bonuses', 'Reason to respond now', 'Close and call to action',
  'Perfect marketing thesis', 'Marketing thesis solution', 'The big idea',
  'Primary promise', 'Unique mechanism & type', 'Relevant metaphors',
  'Front end ascension model', 'Open loops', 'Headlines', 'Perfect lead',
  'Credibility', '4 Beliefs', 'EMBC', 'CPB Chunks', 'Minimum viable funnel',
  'Traffic captivation page', 'Perfect marketing/sales page', 'VSL structure/outline',
  'Order form elements', 'Perfect upsell sequence', 'Additional optimizations',
];

export default function LaunchDocument() {
  const { currentProject, updateLaunchDoc } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const launchDoc = currentProject?.launchDoc;
  const isGenerated = launchDoc && launchDoc.sections && launchDoc.sections.length > 0;

  const handleGenerate = async () => {
    if (!currentProject?.offer || !currentProject?.avatar || !currentProject?.manifold) {
      alert('Please complete all previous steps first');
      return;
    }

    setLoading(true);
    try {
      const docData = await generateLaunchDocument({
        offer: currentProject.offer,
        avatar: currentProject.avatar,
        competitors: currentProject.competitors,
        manifold: currentProject.manifold,
      });
      
      updateLaunchDoc(docData);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate launch document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'md') => {
    // TODO: Implement export functionality
    alert(`Export as ${format.toUpperCase()} will be implemented`);
  };

  const filteredSections = launchDoc?.sections?.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Launch Document</h1>
            </div>
            <p className="text-gray-600">
              Comprehensive 38+ section marketing brief using Todd Brown's E5 VSL methodology
            </p>
          </div>
          
          {isGenerated && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('md')}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>MD</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>DOCX</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!isGenerated ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generate Your Launch Document
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Combine all your insights from Offer Builder, Avatar Builder, Competitor Intelligence, and AI Manifold into one comprehensive marketing brief with 38+ strategic sections.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-3">Document will include:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Complete prospect analysis & psychology profile
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  10-point product analysis & benefit matrix
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Perfect offer engineering with pricing & terms
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Big idea, unique mechanism, & headlines
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  VSL structure, funnel architecture, & upsell sequence
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Complete sales page & marketing thesis
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary text-lg px-8 py-3 flex items-center space-x-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating Document...</span>
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                <span>Generate Launch Document</span>
              </>
            )}
          </button>

          {loading && (
            <p className="text-sm text-gray-500 mt-4">
              This may take 2-3 minutes. Please don't close this page.
            </p>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sections..."
                    className="input pl-10 text-sm"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-3 text-gray-700">
                Table of Contents ({launchDoc.sections.length} sections)
              </h3>
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {(searchTerm ? filteredSections : launchDoc.sections).map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(index);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSection === index
                        ? 'bg-primary-100 text-primary-900 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {section.id}. {section.title}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-outline w-full text-sm"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-3">
            <div className="card">
              {launchDoc.sections[selectedSection] && (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {launchDoc.sections[selectedSection].title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Section {launchDoc.sections[selectedSection].id} of {launchDoc.sections.length}
                    </p>
                  </div>
                  
                  <div className="prose max-w-none">
                    <ReactMarkdown>
                      {launchDoc.sections[selectedSection].content}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => setSelectedSection(Math.max(0, selectedSection - 1))}
                      disabled={selectedSection === 0}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setSelectedSection(Math.min(launchDoc.sections.length - 1, selectedSection + 1))}
                      disabled={selectedSection === launchDoc.sections.length - 1}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

