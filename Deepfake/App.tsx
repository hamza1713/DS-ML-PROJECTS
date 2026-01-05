
import React, { useState, useRef, useCallback } from 'react';
import { 
  Shield, 
  Upload, 
  FileVideo, 
  Type as TextIcon, 
  ImageIcon, 
  RefreshCcw, 
  Search,
  Scan,
  Database,
  Mic
} from 'lucide-react';
import { ContentType, AnalysisState } from './types';
import { analyzeContent } from './services/geminiService';
import { ScanningAnimation } from './components/ScanningAnimation';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.IMAGE);
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    previewUrl: null,
    textContent: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setState({
      isAnalyzing: false,
      result: null,
      error: null,
      previewUrl: null,
      textContent: ''
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setState(prev => ({ ...prev, error: "File too large. Please upload media under 15MB." }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setState(prev => ({ ...prev, previewUrl, isAnalyzing: true, error: null, result: null }));

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await analyzeContent(activeTab, {
          base64,
          mimeType: file.type
        });
        setState(prev => ({ ...prev, result, isAnalyzing: false }));
      };
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isAnalyzing: false }));
    }
  };

  const handleTextAnalysis = async () => {
    if (!state.textContent.trim()) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true, error: null, result: null }));
    try {
      const result = await analyzeContent(ContentType.TEXT, state.textContent);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isAnalyzing: false }));
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getAcceptType = () => {
    switch(activeTab) {
      case ContentType.IMAGE: return "image/*";
      case ContentType.VIDEO: return "video/*";
      case ContentType.AUDIO: return "audio/*";
      default: return "*/*";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
      {/* Header */}
      <header className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Forensic Grade AI Detection</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-6">
          VeriLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Secure your truth. Detect synthetic media, deepfakes, voice clones, and AI-generated text with advanced forensic analysis powered by Gemini 3.0 Flash.
        </p>
      </header>

      {/* Main Analysis Container */}
      <main className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-900/80 overflow-x-auto">
          <button 
            onClick={() => { setActiveTab(ContentType.IMAGE); resetState(); }}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold transition-all ${activeTab === ContentType.IMAGE ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <ImageIcon className="w-5 h-5" /> Image
          </button>
          <button 
            onClick={() => { setActiveTab(ContentType.VIDEO); resetState(); }}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold transition-all ${activeTab === ContentType.VIDEO ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <FileVideo className="w-5 h-5" /> Video
          </button>
          <button 
            onClick={() => { setActiveTab(ContentType.AUDIO); resetState(); }}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold transition-all ${activeTab === ContentType.AUDIO ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Mic className="w-5 h-5" /> Audio
          </button>
          <button 
            onClick={() => { setActiveTab(ContentType.TEXT); resetState(); }}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold transition-all ${activeTab === ContentType.TEXT ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <TextIcon className="w-5 h-5" /> Text
          </button>
        </div>

        <div className="p-8 lg:p-12">
          {activeTab === ContentType.TEXT ? (
            <div className="space-y-6">
              <textarea
                value={state.textContent}
                onChange={(e) => setState(prev => ({ ...prev, textContent: e.target.value }))}
                placeholder="Paste the text content you want to analyze for AI-generation hallmarks..."
                className="w-full h-48 p-6 bg-gray-950 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-200 placeholder:text-gray-600 outline-none"
              />
              <button
                onClick={handleTextAnalysis}
                disabled={state.isAnalyzing || !state.textContent.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                {state.isAnalyzing ? (
                  <><RefreshCcw className="w-5 h-5 animate-spin" /> Analyzing Narrative Patterns...</>
                ) : (
                  <><Search className="w-5 h-5" /> Scan Text Content</>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {!state.previewUrl ? (
                <div 
                  onClick={triggerFileUpload}
                  className="group relative cursor-pointer border-2 border-dashed border-gray-700 hover:border-blue-500/50 bg-gray-950/50 hover:bg-gray-900 transition-all rounded-3xl p-16 text-center"
                >
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Drop your media here</h3>
                  <p className="text-gray-500">Supported: JPG, PNG, WEBP, MP4, MP3, WAV (Max 15MB)</p>
                  <div className="mt-8 inline-block px-6 py-2 bg-gray-900 text-sm font-semibold rounded-full border border-gray-800">
                    Browse Files
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden bg-black p-12 min-h-[300px] flex items-center justify-center">
                  {state.isAnalyzing && <ScanningAnimation />}
                  
                  {activeTab === ContentType.IMAGE && (
                    <img src={state.previewUrl} alt="Preview" className="max-h-[500px] object-contain w-full" />
                  )}
                  {activeTab === ContentType.VIDEO && (
                    <video src={state.previewUrl} className="max-h-[500px] w-full" controls />
                  )}
                  {activeTab === ContentType.AUDIO && (
                    <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center space-y-6">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Mic className="w-8 h-8 text-blue-500" />
                      </div>
                      <audio src={state.previewUrl} className="w-full" controls />
                      <p className="text-sm text-gray-400 font-mono">Forensic Audio Sample Loaded</p>
                    </div>
                  )}
                  
                  {state.isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                      <div className="relative">
                        <Scan className="w-16 h-16 text-blue-500 animate-pulse mb-4" />
                        <div className="absolute -inset-4 border-2 border-blue-500/30 rounded-full animate-[ping_2s_infinite]"></div>
                      </div>
                      <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">
                        {activeTab === ContentType.AUDIO ? 'Analyzing Spectral Data...' : 'Running Forensic Scan...'}
                      </p>
                    </div>
                  )}

                  {!state.isAnalyzing && (
                    <button 
                      onClick={resetState}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-all"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept={getAcceptType()}
          />

          {/* Results Area */}
          {state.error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
              <Shield className="w-5 h-5 shrink-0" />
              {state.error}
            </div>
          )}

          {state.result && <ResultCard result={state.result} />}
        </div>
      </main>

      {/* Features Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Scan className="w-6 h-6 text-blue-500" />,
            title: "Neural Artifact Detection",
            desc: "Identifies GAN, Diffusion, and TTS anomalies that are invisible or inaudible to humans."
          },
          {
            icon: <Database className="w-6 h-6 text-indigo-500" />,
            title: "Spectral Fingerprinting",
            desc: "Analyzes audio frequency consistency and vocal breathing patterns for authenticity."
          },
          {
            icon: <Shield className="w-6 h-6 text-emerald-500" />,
            title: "Zero-Trust Architecture",
            desc: "Processes forensic data in real-time without storing sensitive user media."
          }
        ].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800/50 hover:bg-gray-900 transition-all duration-300">
            <div className="mb-6">{f.icon}</div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-600 text-sm pb-12">
        <p>© 2024 VeriLens AI Digital Forensic Labs. Powered by Gemini 3.0.</p>
      </footer>
    </div>
  );
};

export default App;
