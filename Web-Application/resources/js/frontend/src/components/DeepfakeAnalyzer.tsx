import React, { useState } from 'react';
import { Upload, Zap } from 'lucide-react';
import AnalysisLoader from './AnalysisLoader';
import ResultsDisplay from './ResultsDisplay';

interface AnalysisResult {
  prediction: 'Real' | 'Fake';
  confidence: number;
  limeImage: string;
  explanation: string;
}

const DeepfakeAnalyzer: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Simulate API call with realistic timing
  const simulateAnalysis = async (file: File): Promise<AnalysisResult> => {
    // Random analysis time between 10-40 seconds
    const analysisTime = Math.random() * 30000 + 10000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock results
        const confidence = Math.random() * 0.4 + 0.3; // 30-70%
        const prediction = Math.random() > 0.5 ? 'Real' : 'Fake';
        
        resolve({
          prediction,
          confidence,
          limeImage: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
          explanation: `The model analyzed 30 frames and predicted this video is ${prediction} with ${Math.round(confidence * 100)}% confidence. Key areas in frame 10 influenced this decision. ${
            prediction === 'Fake' 
              ? 'Signs include subtle blending artifacts around facial features and inconsistent lighting patterns.'
              : 'Consistent lighting, natural facial structure, and authentic micro-expressions support this determination.'
          }`
        });
      }, analysisTime);
    });
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setIsAnalyzing(true);
    
    try {
      const analysisResult = await simulateAnalysis(file);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setResult(null);
    setSelectedFile(null);
  };

  if (isAnalyzing) {
    return <AnalysisLoader fileName={selectedFile?.name || ''} />;
  }

  if (result) {
    return <ResultsDisplay result={result} onReset={resetAnalyzer} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-cyan-500/20 rounded-full border border-cyan-400/30">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              DeepGuard AI
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced deepfake detection powered by neural analysis
          </p>
        </div>

        {/* Upload Zone */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 md:p-12 w-full max-w-2xl">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            
            <label
              htmlFor="video-upload"
              className="cursor-pointer block"
            >
              <div className="border-2 border-dashed border-cyan-400/50 rounded-xl p-12 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/5 group">
                <div className="text-center">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Upload className="w-16 h-16 text-cyan-400 mx-auto relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Upload Video for Analysis
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Click or drag your video file here
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported: MP4, MOV, AVI • Max: 100MB
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          {[
            { title: 'Neural Analysis', desc: 'Advanced AI models detect subtle manipulation patterns' },
            { title: 'Real-time Processing', desc: 'Get results in 10-40 seconds with detailed explanations' },
            { title: 'LIME Visualization', desc: 'See exactly which regions influenced the prediction' }
          ].map((item, i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeepfakeAnalyzer;