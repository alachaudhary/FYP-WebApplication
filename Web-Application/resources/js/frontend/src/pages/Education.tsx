import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Eye, AlertTriangle, Users, Brain, Zap,
  CheckCircle
} from 'lucide-react';

function Education() {
  const risks = [
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      title: "Misinformation",
      description: "Fake videos can spread false information and manipulate public opinion"
    },
    {
      icon: <Users className="h-6 w-6 text-orange-500" />,
      title: "Identity Theft",
      description: "Personal likeness can be stolen and used without consent"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Fraud & Scams",
      description: "Criminals use deepfakes for financial fraud and social engineering"
    }
  ];

  const videos = [
    {
      id: "etSfYERBK28?si=WKFklQnMh7Ox4gJC",
      title: "What Are Deepfakes?",
      description: "A comprehensive introduction to deepfake technology and its implications"
    },
    {
      id: "h0ARRw97PFY?si=jL35zGJ6LxuGKIAV",
      title: "How Deepfakes Are Created",
      description: "Understanding the AI technology behind deepfake generation"
    },
    {
      id: "7akzhpx0EIU?si=isn-mzNOtaUE4yMn",
      title: "Spotting Deepfakes",
      description: "Learn the telltale signs that reveal manipulated content"
    }
  ];

  const indicators = [
    {
      title: "Unnatural Eye Movement",
      description: "Eyes that don't blink naturally or track movement properly",
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: "Facial Inconsistencies",
      description: "Blurring around face edges, mismatched skin tones, or lighting issues",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      title: "Audio Mismatches",
      description: "Voice doesn't match lip movements or sounds robotic",
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: "Temporal Inconsistencies",
      description: "Sudden changes in quality, lighting, or facial features between frames",
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const safetyTips = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Verify Sources",
      description: "Always check if content comes from reputable, verified sources"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Cross-Reference",
      description: "Look for the same story or video from multiple reliable news outlets"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Use Detection Tools",
      description: "Utilize AI-powered detection platforms like FauxShield for verification"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Stay Informed",
      description: "Keep up with the latest deepfake detection techniques and awareness"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Think Critically",
      description: "Question sensational content, especially if it seems too shocking to be true"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Report Suspicious Content",
      description: "Flag potentially fake content on social media platforms"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Understanding Deepfakes</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn to identify, understand, and protect yourself from deepfakes in our comprehensive educational guide.
          </p>
        </div>
      </section>

      {/* Risks Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Are Deepfakes?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Deepfakes are synthetic media created using artificial intelligence to replace a person's likeness 
              with someone else's. This technology uses deep learning algorithms to analyze and manipulate video, 
              audio, and images, creating convincing but fake content that can be difficult to distinguish from reality.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {risks.map((risk, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    {risk.icon}
                    <h3 className="text-lg font-semibold ml-3 text-gray-900 dark:text-white">{risk.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Education Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Educational Videos</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Watch these informative videos to deepen your understanding of deepfake technology
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indicators Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How to Analyze a Deepfake</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Learn to identify common indicators that reveal manipulated content
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {indicators.map((indicator, index) => (
              <div key={index} className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-700 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg text-red-600 dark:text-red-300">
                    {indicator.icon}
                  </div>
                  <h3 className="text-lg font-semibold ml-3 text-red-800 dark:text-red-300">{indicator.title}</h3>
                </div>
                <p className="text-red-700 dark:text-red-400">{indicator.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-indigo-50 dark:bg-indigo-900 rounded-xl p-8 text-left">
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-4">Pro Tip</h3>
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
              While these indicators can help identify deepfakes, the technology is constantly improving. 
              The most reliable approach is to use AI-powered detection tools like FauxShield, which can 
              analyze subtle patterns invisible to the human eye.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Awareness & Safety Tips</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Practical advice to stay safe online and avoid being misled by deepfakes
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-start space-x-4">
                  {tip.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Detect Deepfakes?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Put your knowledge to the test with FauxShield's advanced AI-powered detection technology. 
            Upload your media files and get instant, accurate analysis.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition text-lg font-semibold"
          >
            <Shield className="h-6 w-6" />
            <span>Try FauxShield Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Education;
