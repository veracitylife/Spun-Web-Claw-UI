import { useState } from 'react';
import { Mic, Upload, Play, FileAudio, Download, Check, AlertCircle } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface OpenAIWhisperInterfaceProps {
  skillId: string;
}

const OpenAIWhisperInterface: React.FC<OpenAIWhisperInterfaceProps> = ({ skillId }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile && activeTab === 'upload') return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock transcription process
      await runSkillCommand(skillId, 'transcribe', { 
        file: activeTab === 'upload' ? selectedFile?.name : 'recording.wav',
        mode: activeTab
      });

      setTimeout(() => {
        setTranscription("This is a simulated transcription of the audio content. OpenAI Whisper is a powerful speech recognition model that can handle multiple languages and accents with high accuracy. In a real implementation, this text would come directly from the model's output after processing your audio file.");
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Transcription failed. Please try again.');
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Mock finishing recording
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      // Start timer mock
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="bg-green-500 text-white p-1.5 rounded-lg">
            <Mic size={20} />
          </div>
          OpenAI Whisper
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Upload File
          </button>
          <button 
            onClick={() => setActiveTab('record')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'record' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            Record Audio
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Input Section */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold mb-4 text-lg">Input Source</h3>
            
            {activeTab === 'upload' ? (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {selectedFile ? (
                  <div className="text-green-600 dark:text-green-400 flex flex-col items-center">
                    <FileAudio size={48} className="mb-2" />
                    <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Upload size={48} className="mb-2" />
                    <span className="font-medium">Drop audio file here</span>
                    <span className="text-xs mt-1">or click to browse</span>
                    <span className="text-xs mt-4 text-slate-300">Supports MP3, MP4, MPEG, MPGA, M4A, WAV, and WEBM</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isRecording ? 'bg-red-100 dark:bg-red-900/30 animate-pulse' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <button 
                    onClick={toggleRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
                  >
                    {isRecording ? <div className="w-8 h-8 bg-white rounded-md"></div> : <Mic size={32} />}
                  </button>
                </div>
                {isRecording && (
                  <div className="text-2xl font-mono font-bold text-slate-700 dark:text-slate-200 mb-2">
                    00:0{recordingTime}
                  </div>
                )}
                <p className="text-slate-500 text-sm">
                  {isRecording ? 'Recording in progress...' : 'Click mic to start recording'}
                </p>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Language (Optional)
              </label>
              <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Auto-detect</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <button 
              onClick={handleTranscribe}
              disabled={loading || (activeTab === 'upload' && !selectedFile)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Transcribe Audio
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
            <h3 className="font-semibold text-lg">Transcription Output</h3>
            <div className="flex gap-2">
              <button 
                disabled={!transcription}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy to Clipboard"
              >
                <Check size={18} />
              </button>
              <button 
                disabled={!transcription}
                className="p-2 text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Download Text"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {transcription ? (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {transcription}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <FileAudio size={64} className="mb-4" />
                <p>No transcription yet</p>
                <p className="text-sm">Upload or record audio to see the text here</p>
              </div>
            )}
          </div>
          
          {transcription && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex justify-between px-6">
              <span>Word count: {transcription.split(/\s+/).length}</span>
              <span>Confidence: 98.5%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenAIWhisperInterface;
