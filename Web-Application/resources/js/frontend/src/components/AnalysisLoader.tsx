import React, { useState, useEffect } from 'react';
import { Brain, Scan, Cpu, Eye, Zap } from 'lucide-react';

interface AnalysisLoaderProps {
  fileName: string;
}

const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ fileName }) => {
  const [progress, setProgress] = useState(0);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const scanningImages = [
    'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386435/pexels-photo-8386435.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386441/pexels-photo-8386441.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/8386442/pexels-photo-8386442.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const phases = [
    { icon: Brain, text: 'Initializing neural networks...', duration: 3000 },
    { icon: Scan, text: 'Extracting video frames...', duration: 4000 },
    { icon: Eye, text: 'Analyzing facial features...', duration: 8000 },
    { icon: Cpu, text: 'Processing temporal patterns...', duration: 6000 },
    { icon: Zap, text: 'Computing final prediction...', duration: 4000 }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        // Slower progress as we approach 95%
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return Math.min(95, prev + increment);
      });
    }, 300);

    const imageInterval = setInterval(() => {
      setCurrentScanIndex(prev => (prev + 1) % scanningImages.length);
    }, 800);

    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(imageInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  const CurrentPhaseIcon = phases[currentPhase].icon;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(56,189,248,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.1),transparent_70%)]"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse"></div>
        
        {/* Moving Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-cyan-500/10 border border-cyan-400/30 rounded-full backdrop-blur-sm">
            <CurrentPhaseIcon className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-cyan-300 font-medium">DEEP ANALYSIS IN PROGRESS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Analyzing: <span className="text-cyan-400">{fileName}</span>
          </h1>
          <p className="text-gray-400">{phases[currentPhase].text}</p>
        </div>

        {/* Main Analysis Display */}
        <div className="relative mb-8">
          {/* Scanning Image with Overlay */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl">
            <img
              src={scanningImages[currentScanIndex]}
              alt="Neural Analysis"
              className="w-80 h-60 md:w-96 md:h-72 object-cover transition-all duration-500"
            />
            
            {/* Scan Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent animate-scan-line"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-neural-grid opacity-30"></div>
            
            {/* Corner Brackets */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyan-400"></div>
            
            {/* Status Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded px-4 py-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cyan-400">Frame Analysis</span>
                <span className="text-green-400">● ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Holographic Effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-3xl blur-xl animate-pulse"></div>
        </div>

        {/* Progress Section */}
        <div className="w-full max-w-md space-y-4">
          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-cyan-400/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3">
              <div className="text-xl font-bold text-cyan-400">{Math.floor(Math.random() * 30 + 15)}</div>
              <div className="text-xs text-gray-400">Frames</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-400">{Math.floor(Math.random() * 50 + 20)}s</div>
              <div className="text-xs text-gray-400">Elapsed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-3">
              <div className="text-xl font-bold text-green-400">{Math.floor(Math.random() * 100 + 500)}</div>
              <div className="text-xs text-gray-400">Features</div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-sm text-gray-400 max-w-md">
          <p>Neural networks are analyzing temporal inconsistencies, facial landmarks, and compression artifacts to determine authenticity.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoader;