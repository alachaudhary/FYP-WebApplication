import React, { useState } from 'react';
import { ZoomIn, Shield, AlertTriangle, Eye, Brain, X } from 'lucide-react';
import ConfidenceChart from './ConfidenceChart';

interface AnalysisResult {
  prediction: string;
  confidence: number;
  limeImage: string;
  explanation: string;
  framesAnalyzed: number;
  processingTime: number;
}

interface ResultsDisplayProps {
  result: AnalysisResult;
  onClose: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onClose }) => {
  const [imageZoomed, setImageZoomed] = useState(false);
  const isReal = result.prediction?.toLowerCase() === 'real';

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-y-auto">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,${isReal ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'},transparent_70%)]`}></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analysis Complete
            </h1>
            <p className="text-gray-400 mt-1">Neural analysis results</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        {/* Main Results Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Prediction Result */}
            <div className="relative">
              <div className={`absolute -inset-1 bg-gradient-to-r ${isReal ? 'from-green-600 to-emerald-600' : 'from-red-600 to-rose-600'} rounded-2xl blur opacity-25`}></div>
              <div className="relative bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-8">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 mb-6 px-6 py-3 ${isReal ? 'bg-green-500/10 border-green-400/30' : 'bg-red-500/10 border-red-400/30'} border rounded-full`}>
                    {isReal ? (
                      <Shield className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    )}
                    <span className={`font-semibold ${isReal ? 'text-green-300' : 'text-red-300'}`}>
                      PREDICTION COMPLETE
                    </span>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-sm text-gray-400 mb-2">Classification Result</h2>
                    <div className={`text-5xl font-bold mb-4 ${isReal ? 'text-green-400' : 'text-red-400'}`}>
                      {result.prediction?.toUpperCase() || 'N/A'}
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      isReal 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}>
                      {isReal ? 'Authentic Content' : 'Synthetic Content Detected'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Chart */}
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                Confidence Analysis
              </h3>
              <ConfidenceChart confidence={result.confidence} isReal={isReal} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Model Accuracy', value: '89.9%', color: 'text-blue-400' },
                { label: 'Processing Time', value: `${result.processingTime}s`, color: 'text-purple-400' },
                { label: 'Frames Analyzed', value: `${result.framesAnalyzed}`, color: 'text-green-400' }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* LIME Image */}
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                LIME Explanation
              </h3>

              <div className="relative group cursor-pointer" onClick={() => setImageZoomed(!imageZoomed)}>
                <div className="relative rounded-xl overflow-hidden border border-cyan-400/30">
                  <img
                    src={result.limeImage}
                    alt="LIME Explanation"
                    className={`w-full transition-all duration-300 ${imageZoomed ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <ZoomIn className="w-6 h-6 text-white mx-auto mb-2" />
                      <span className="text-white text-sm">Click to zoom</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-full group-hover:translate-x-full duration-1000"></div>
                </div>
                <p className="text-sm text-gray-400 mt-3 text-center">
                  Highlighted regions show areas that influenced the model's decision
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>{result.explanation}</p>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-semibold text-white mb-2">Technical Details:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="text-cyan-400">CNN (Xception) + RNN (Bi-LSTM)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Feature Extraction:</span>
                      <span className="text-cyan-400">Multi-scale Analysis</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Detection Method:</span>
                      <span className="text-cyan-400">Ensemble Learning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              This analysis was performed using state-of-the-art deepfake detection models.
              Results are for informational purposes and should be considered alongside other verification methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
