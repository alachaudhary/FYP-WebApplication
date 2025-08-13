import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload, Brain, Users, ChevronDown, ChevronUp, Mail } from 'lucide-react';

function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is a deepfake and why should I be concerned?",
      answer: "A deepfake is synthetic media where a person's likeness is replaced with someone else's using artificial intelligence. This technology can be misused to create convincing but fake videos, images, or audio, potentially leading to misinformation, fraud, or reputation damage."
    },
    {
      question: "How accurate is FauxShield's detection technology?",
      answer: "FauxShield's AI-powered detection system achieves over 95% accuracy in identifying deepfakes. We continuously train our models on the latest deepfake techniques to maintain high detection rates and minimize false positives."
    },
    {
      question: "What types of media can FauxShield analyze?",
      answer: "Currently, FauxShield can analyze images and videos for signs of manipulation. We support common formats including JPG, PNG, MP4, and MOV files, with a file size limit of 100MB for optimal processing."
    },
    {
      question: "How does the explainable AI feature work?",
      answer: "Our explainable AI provides detailed insights into why content is flagged as potentially manipulated. It highlights specific areas of concern and explains the technical indicators that led to the determination, making the process transparent and understandable."
    },
    {
      question: "Is my uploaded content secure and private?",
      answer: "Yes, we take privacy seriously. All uploaded content is encrypted, processed securely, and automatically deleted after analysis. We never store or share your media files without explicit consent."
    },
    {
      question: "What makes FauxShield different from other detection tools?",
      answer: "FauxShield combines state-of-the-art AI detection with user-friendly explanations and educational resources. Our comprehensive approach helps users not just detect deepfakes but understand how they work and how to protect themselves."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
              Detect Deepfakes with
              <span className="text-indigo-600 block mt-2">AI-Powered Precision</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              FauxShield is your go-to platform for detecting and understanding deepfake content
              using state-of-the-art artificial intelligence.
            </p>
            <Link to="/dashboard" className="inline-block">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-3 mx-auto text-lg">
                <Upload className="h-6 w-6" />
                <span>Upload Image</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <a href="#services" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Scroll to learn more</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-12 w-12 text-indigo-600" />,
                title: "Deepfake Detection",
                description: "Accurate detection of manipulated images and videos using advanced AI algorithms.",
                image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop"
              },
              {
                icon: <Brain className="h-12 w-12 text-indigo-600" />,
                title: "Explainable AI",
                description: "Transparent AI decision-making that builds user trust through clear explanations.",
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop"
              },
              {
                icon: <Users className="h-12 w-12 text-indigo-600" />,
                title: "User Education",
                description: "Comprehensive resources to help you identify deepfakes and understand AI technology.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop"
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition">
                <div className="mb-4">{service.icon}</div>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Goals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "High-Accuracy Detection",
                description: "Ensure the highest accuracy in identifying deepfakes using cutting-edge AI technology."
              },
              {
                title: "Transparency",
                description: "Provide clear, understandable explanations for every AI decision we make."
              },
              {
                title: "User-Friendly Design",
                description: "Create an intuitive, scalable platform that anyone can use effectively."
              }
            ].map((goal, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3 text-indigo-600">{goal.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get answers to common questions about deepfake detection and our services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-left font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-indigo-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
            <a
              href="mailto:contact@fauxshield.com"
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Mail className="h-5 w-5" />
              <span>Contact our support team</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
